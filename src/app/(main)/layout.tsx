import { cookies } from "next/headers"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

import { Provider } from "@/app/(main)/provider"
import { getProxyUser } from "@/server/lib/proxy-user"
import { userService } from "@/server/service/user-service"

const SIDEBAR_COOKIE_NAME = "sidebar_state"

interface MainLayoutProps {
  children: React.ReactNode
}

// 主体布局：注入全部文案与业务 Provider。
export default async function MainLayout({ children }: MainLayoutProps) {
  const cookieStore = await cookies()
  const defaultSidebarOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true"
  const proxyUser = await getProxyUser()
  const userInfo = proxyUser ? await userService.getById(proxyUser.userId) : null
  const title = process.env.TITLE || "Pixtale"
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Provider
        defaultSidebarOpen={defaultSidebarOpen}
        initialUserInfo={userInfo}
        title={title}
      >
        {children}
      </Provider>
    </NextIntlClientProvider>
  )
}
