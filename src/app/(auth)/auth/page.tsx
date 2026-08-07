"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { useRouter, useServerInsertedHTML } from "next/navigation"
import { useTheme, type Theme } from "@/app/provider"
import { LoginForm } from "@/components/login/login-form"
import { login } from "@/request/login"
import { type LoginBo } from "@/server/entity/bo/login"

// 登录页：提交登录后跳转主体页面。
export default function AuthPage() {
  const title = process.env.TITLE || "Pixtale"
  // loading 标记登录请求是否正在提交。
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  // previousTheme 保存进入登录页前的主题，离开时恢复。
  const previousThemeRef = useRef<Theme>(theme)

  useServerInsertedHTML(() => (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var el=document.documentElement;el.classList.remove("dark");el.style.colorScheme="light";})();`,
      }}
    />
  ))

  // rewrite 不会改地址栏，进入登录页后强制同步为 /auth。
  useLayoutEffect(() => {
    if (window.location.pathname !== "/auth") {
      window.history.replaceState(null, "", "/auth")
    }
  }, [])

  // 进入登录页强制浅色，离开时恢复原主题。
  useLayoutEffect(() => {
    previousThemeRef.current = theme
    document.documentElement.classList.remove("dark")
    document.documentElement.style.colorScheme = "light"

    return () => {
      setTheme(previousThemeRef.current)
    }
  }, [setTheme])

  // 请求登录接口，成功后跳转照片页面，由主体 layout 注入用户与业务数据。
  function handleLogin(params: LoginBo) {
    setLoading(true)

    login(params)
      .then(() => {
        router.replace("/photos")
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div className="relative isolate flex min-h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[#fefcff] p-6 md:p-10">
      {/* Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
            radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <LoginForm title={title} loading={loading} onLogin={handleLogin} />
      </div>
    </div>
  )
}
