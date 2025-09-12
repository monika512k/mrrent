import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mr-rent.net',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api2.mr-rent.net',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
