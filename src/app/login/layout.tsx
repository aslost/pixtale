import { type Metadata } from "next"
import { getTranslations } from "next-intl/server"

// 根据当前语言生成登录页元数据。
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("login")
  const appName = process.env.TITLE || "Pixtale"

  return {
    title: t("metaTitle", { appName }),
    description: t("metaDescription", { appName }),
    robots: {
      index: false,
      follow: false,
    },
  }
}

interface LoginLayoutProps {
  children: React.ReactNode
}

// 登录页布局，仅透传子节点并提供页面元数据。
export default function LoginLayout({ children }: LoginLayoutProps) {
  return children
}
