import type { MetadataRoute } from "next"

// 仅禁止爬虫抓取登录页。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login"],
    },
  }
}
