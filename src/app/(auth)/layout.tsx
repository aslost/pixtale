import { type Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"

// 根据当前语言生成登录侧元数据。
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("login")
  const title = process.env.TITLE || "Pixtale"

  return {
    title: t("metaTitle", { appName: title }),
    description: t("metaDescription"),
    robots: {
      index: false,
      follow: false,
    },
  }
}

interface AuthLayoutProps {
  children: React.ReactNode
}

// 登录侧最简布局：只注入 login 文案。
export default async function AuthLayout({ children }: AuthLayoutProps) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={{ login: messages.login }}>
      {children}
    </NextIntlClientProvider>
  )
}
