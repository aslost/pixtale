import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const nextConfig: NextConfig = {
  reactStrictMode: false,
  // 把应用标题暴露给客户端页面（如登录页）。
  env: {
    TITLE: process.env.TITLE || "Pixtale",
  },
  serverExternalPackages: ['exiftool-vendored', 'better-sqlite3'],
  // Vercel 不用 standalone；Docker 自建部署才需要。
  output: process.env.VERCEL ? undefined : 'standalone',
  // standalone 需要把平台对应的原生依赖资源一并打进产物。
  outputFileTracingIncludes: {
    "/**":
      process.platform === "win32"
        ? [
            "./node_modules/@img/sharp-win32-x64/**/*",
            "./node_modules/exiftool-vendored.exe/**/*",
          ]
        : ["./node_modules/exiftool-vendored.pl/**/*"],
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

export default withNextIntl(nextConfig);
