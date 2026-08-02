"use client"

import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react"
import { LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/app/provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent, CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { type LoginBo } from "@/server/entity/bo/login"
import { useTranslations } from "next-intl"

interface LoginFormProps extends React.ComponentProps<"div"> {
  loading?: boolean
  onLogin: (params: LoginBo) => void
}

export function LoginForm({
  className,
  loading = false,
  onLogin,
  ...props
}: LoginFormProps) {
  const t = useTranslations("login")
  const { title } = useApp()
  // form 保存登录表单的用户名和密码。
  const [form, setForm] = useState<LoginBo>({
    username: "",
    password: "",
  })

  // 若配置了演示账号，则预填到登录表单。
  useEffect(() => {
    const username = process.env.NEXT_PUBLIC_DEMO_USERNAME
    const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD

    if (!username && !password) {
      return
    }

    setForm((prev) => ({
      username: username || prev.username,
      password: password || prev.password,
    }))
  }, [])

  // 更新登录表单字段。
  function updateField(field: keyof LoginBo, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 提交登录表单，把用户名和密码传给登录页面。
  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onLogin({
      username: form.username.trim(),
      password: form.password,
    })
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg shadow-black/10">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex gap-3 items-center">
            <img
              src="/logo.png"
              alt=""
              className="size-10 object-contain"
            />
            {title}
          </CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitLogin} >
            <FieldGroup>
              <Field>
                <Input
                  type="text"
                  placeholder={t("username")}
                  value={form.username}
                  onChange={(event) => updateField("username", event.target.value)}
                  className="bg-white/50"
                  required
                />
              </Field>
              <Field>
                <Input
                  type="password"
                  placeholder={t("password")}
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  className="bg-white/50"
                  required
                />
              </Field>
              <Field className="mb-2">
                <Button type="submit" disabled={loading}>
                  {loading && <LoaderCircle className="animate-spin" />}
                  {t("signIn")}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
