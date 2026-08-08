"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login/login-form"
import { login } from "@/request/login"
import { type LoginBo } from "@/server/entity/bo/login"

// 登录页：提交登录后跳转主体页面。
export default function AuthPage() {
  const title = process.env.TITLE || "Pixtale"
  // loading 标记登录请求是否正在提交。
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
