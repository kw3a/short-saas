import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '*.ngrok-free.app',
  ],
  images: {
    remotePatterns: [new URL('https://cdn.viralshort.app/*')]
  },
  reactStrictMode: true,
};

export default nextConfig;
