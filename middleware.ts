import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log("Middleware token:", !!req.nextauth.token); // Add debug log
    
    const isLoggedIn = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

    if (isAuthPage) {
      if (isLoggedIn) {
        console.log("Redirecting to dashboard from auth page"); // Debug log
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      console.log("Redirecting to home - not logged in"); // Debug log
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("Auth callback token:", !!token); // Debug log
        return !!token; // Only authorize if there's a token
      }
    }
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*'
  ]
};