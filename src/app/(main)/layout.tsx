import { cookies } from "next/headers"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

import { Provider, type Theme } from "@/app/(main)/provider"
import { getLoginInfo } from "@/lib/cookie"
import { userService } from "@/server/service/user-service"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const THEME_COOKIE_NAME = "theme"

interface MainLayoutProps {
  children: React.ReactNode
}

// 主体布局：注入全部文案与业务 Provider。
export default async function MainLayout({ children }: MainLayoutProps) {
  const cookieStore = await cookies()
  // 仅显式 dark 时启用暗色，其余默认浅色。
  const defaultTheme: Theme = cookieStore.get(THEME_COOKIE_NAME)?.value === "dark" ? "dark" : "light"
  const defaultSidebarOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true"
  const { userId } = await getLoginInfo(cookieStore.toString())
  const userInfo = userId ? await userService.getById(userId) : null
  const title = process.env.TITLE || "Pixtale"
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Provider
        defaultTheme={defaultTheme}
        defaultSidebarOpen={defaultSidebarOpen}
        initialUserInfo={userInfo}
        title={title}
      >
        {children}
      </Provider>
    </NextIntlClientProvider>
  )
}
