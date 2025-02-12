import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/mangadex/:path*", // Proxy requests to /mangadex
        destination: "https://api.mangadex.org/:path*", // Redirect to MangaDex API
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads.mangadex.org", // For MangaDex Cover
      },
      {
        protocol: "https",
        hostname: "*.mangadex.network", // For MangaDex Chapters
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // For Youtube
      },
      {
        protocol: "https",
        hostname: "scontent.fmnl8-6.fna.fbcdn.net", // For Facebook
      },
      {
        protocol: "https",
        hostname: "instagram.fmnl8-6.fna.fbcdn.net", // For Instagram
      },
      {
        protocol: "https",
        hostname: "p16-sign-sg.tiktokcdn.com", // For Tiktok
      },
    ],
  },
};

export default nextConfig;
