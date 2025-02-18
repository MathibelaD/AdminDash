import { NextAuthOptions } from "next-auth";
import { prisma } from "../lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize function called"); // Debug log

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user?.password) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.profileImage
        };
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Add error page
    newUser: "/auth/new-user" // Optional: redirect new users here
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl }); // Debug log
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ session, token }) {
      console.log("Session callback:", { session, token }); // Debug log
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture
        };
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log("JWT callback:", { token, user, account }); // Debug log
      
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.image
        };
      }

      // Return previous token if the user exists in db
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email!,
        },
      });

      if (!dbUser) {
        return token;
      }

      return {
        id: dbUser.id,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
        email: dbUser.email,
        picture: dbUser.profileImage,
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logs in both dev and prod temporarily
};