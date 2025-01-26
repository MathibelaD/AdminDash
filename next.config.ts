import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Skips ESLint during builds
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  }
};

export default nextConfig;
