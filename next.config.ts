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
        protocol: 'https',
        hostname: 'uploads.mangadex.org', // For MangaDex Cover
      },
      {
        protocol: 'https',
        hostname: '*.mangadex.network', // For MangaDex Chapters
      },
    ],
  },
};

export default nextConfig;