"use client"

import { useLayoutEffect, useState } from "react"
import { useRouter, useServerInsertedHTML } from "next/navigation"
import { LoginForm } from "@/components/login/login-form"
import { login } from "@/request/login"
import { userInfo } from "@/request/user"
import { type LoginBo } from "@/server/entity/bo/login"
import { useApp } from "@/app/provider"

export default function LoginPage() {
  const { refreshAlbums, refreshStorages, setUserInfo, theme, setTheme } = useApp()
  // loading 标记登录请求是否正在提交。
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useServerInsertedHTML(() => (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var el=document.documentElement;el.classList.remove("dark");el.style.colorScheme="light";})();`,
      }}
    />
  ))

  // 进入登录页强制亮色，离开时恢复用户保存的默认主题。
  useLayoutEffect(() => {
    document.documentElement.classList.remove("dark")
    document.documentElement.style.colorScheme = "light"
    return () => {
      setTheme(theme)
    }
  }, [])

  // 请求登录接口，成功后拉取当前用户信息并跳转照片页面。
  function handleLogin(params: LoginBo) {
    setLoading(true)

    login(params)
      .then(() => userInfo())
      .then((info) => {
        setUserInfo(info)
        router.replace("/photos")
        void refreshAlbums()
        void refreshStorages()
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
        <LoginForm loading={loading} onLogin={handleLogin} />
      </div>
    </div>
  )
}
