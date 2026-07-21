import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.2.104'],
  reactStrictMode: false,
  serverExternalPackages: ['exiftool-vendored', 'better-sqlite3'],
  // Vercel 不用 standalone；Docker 自建部署才需要。
  output: process.env.VERCEL ? undefined : 'standalone',
  typescript: {
    // ⚠️ 生产环境建议不要开启
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
