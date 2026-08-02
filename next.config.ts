import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const nextConfig: NextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ['exiftool-vendored', 'better-sqlite3'],
  // Vercel 不用 standalone；Docker 自建部署才需要。
  output: process.env.VERCEL ? undefined : 'standalone',
  // Windows standalone 需要把原生依赖资源一并打进产物。
  ...(process.platform === "win32"
    ? {
        outputFileTracingIncludes: {
          "/**": [
            "./node_modules/@img/sharp-win32-x64/**/*",
            "./node_modules/exiftool-vendored.exe/**/*",
          ],
        },
        typescript: {
          // Windows 本地打包时跳过 TypeScript 类型检查。
          ignoreBuildErrors: true,
        },
      }
    : {}),
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

export default withNextIntl(nextConfig);
