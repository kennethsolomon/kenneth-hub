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
        hostname: 'uploads.mangadex.org',
      },
      {
        protocol: 'https',
        hostname: 'cmdxd98sb0x3yprd.mangadex.network',
      },
    ],
  },
};

export default nextConfig;