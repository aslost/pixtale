import { cookies } from "next/headers"
import { Geist } from "next/font/google"
import { type Metadata } from "next"

import { Provider, type Theme } from "@/app/provider"
import { getUserId } from "@/lib/cookie"
import { userService } from "@/server/service/user-service"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const THEME_COOKIE_NAME = "theme"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: process.env.title || "",
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

// 渲染应用根布局，并在页面绘制前恢复保存的主题。
export default async function RootLayout({ children }: RootLayoutProps) {

  const cookieStore = await cookies()
  const defaultTheme: Theme = cookieStore.get(THEME_COOKIE_NAME)?.value === "light" ? "light" : "dark"
  const defaultSidebarOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true"
  const userId = await getUserId(cookieStore.toString())
  const userInfo = userId ? await userService.getById(userId) : null
  const title = process.env.title || ""

  return (
    <html lang="en" className={`${geist.variable} ${defaultTheme}`} suppressHydrationWarning>
      <head />
      <body>
        <Provider
          defaultTheme={defaultTheme}
          defaultSidebarOpen={defaultSidebarOpen}
          initialUserInfo={userInfo}
          title={title}
        >
          {children}
        </Provider>
      </body>
    </html>
  )
}
