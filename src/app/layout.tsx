import { cookies } from "next/headers"
import { Geist } from "next/font/google"
import { type Metadata } from "next"
import { getLocale } from "next-intl/server"

import { ThemeProvider, type Theme } from "@/app/provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

const THEME_COOKIE_NAME = "theme"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: process.env.TITLE || "Pixtale",
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

// 最简根布局：html/body、字体，以及主题 Provider。
export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies()
  // 仅显式 light 时启用浅色，其余默认暗色。
  const defaultTheme: Theme = cookieStore.get(THEME_COOKIE_NAME)?.value === "light" ? "light" : "dark"
  const locale = await getLocale()

  return (
    <html lang={locale} className={`${geist.variable} ${defaultTheme}`} suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider defaultTheme={defaultTheme}>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
