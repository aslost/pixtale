import { cookies } from "next/headers"
import { Geist } from "next/font/google"
import { type Metadata } from "next"
import { getLocale } from "next-intl/server"

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

// 最简根布局：html/body、字体，以及主题 class（默认浅色）。
export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies()
  const theme = cookieStore.get(THEME_COOKIE_NAME)?.value === "dark" ? "dark" : "light"
  const locale = await getLocale()

  return (
    <html lang={locale} className={`${geist.variable} ${theme}`} suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  )
}
