import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

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
