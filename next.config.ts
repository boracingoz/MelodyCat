import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.scdn.co"], // Spotify görselleri için izin
  },
};

export default nextConfig;
