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
    <div className="relative isolate flex min-h-svh w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[#ECF5FC] p-6 md:p-10">
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute bottom-0 left-0 -z-20 size-[clamp(24rem,60vw,60rem)] -translate-x-[40%] translate-y-[40%]"
        aria-hidden="true"
      >
        <path
          fill="#FF0066"
          d="M51.8,-70.6C67.3,-60.1,80.1,-45.1,85.3,-28C90.5,-10.9,88,8.5,81.8,26.2C75.5,43.9,65.4,60,51.1,70C36.9,80.1,18.4,84.1,0.1,84C-18.3,83.9,-36.6,79.7,-52.3,70.1C-68.1,60.6,-81.4,45.7,-87.2,28.3C-92.9,10.8,-91.1,-9.1,-85.1,-27.7C-79.1,-46.3,-68.9,-63.6,-54.1,-74.4C-39.2,-85.1,-19.6,-89.4,-0.7,-88.4C18.2,-87.4,36.3,-81.2,51.8,-70.6Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute top-0 right-0 -z-20 size-[clamp(24rem,60vw,60rem)] translate-x-[40%] -translate-y-[40%]"
        aria-hidden="true"
      >
        <path
          fill="#9EF0F0"
          d="M51.8,-70.6C67.3,-60.1,80.1,-45.1,85.3,-28C90.5,-10.9,88,8.5,81.8,26.2C75.5,43.9,65.4,60,51.1,70C36.9,80.1,18.4,84.1,0.1,84C-18.3,83.9,-36.6,79.7,-52.3,70.1C-68.1,60.6,-81.4,45.7,-87.2,28.3C-92.9,10.8,-91.1,-9.1,-85.1,-27.7C-79.1,-46.3,-68.9,-63.6,-54.1,-74.4C-39.2,-85.1,-19.6,-89.4,-0.7,-88.4C18.2,-87.4,36.3,-81.2,51.8,-70.6Z"
          transform="translate(100 100)"
        />
      </svg>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm loading={loading} onLogin={handleLogin} />
      </div>
    </div>
  )
}
