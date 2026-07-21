"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
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
  const { title } = useApp()
  const [form, setForm] = useState<LoginBo>({
    username: "",
    password: "",
  })

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

  // 阻止长按回车重复触发表单提交。
  function blockEnterRepeat(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter" && event.repeat) {
      event.preventDefault()
    }
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
            输入账号信息以登录系统
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitLogin} onKeyDown={blockEnterRepeat}>
            <FieldGroup>
              <Field>
                <Input
                  id="text"
                  type="text"
                  autoComplete="off"
                  placeholder="用户名称"
                  value={form.username}
                  onChange={(event) => updateField("username", event.target.value)}
                  className="bg-white/50"
                  required
                />
              </Field>
              <Field>
                <Input
                  id="new-passowrd"
                  type="password"
                  placeholder="密码"
                  autoComplete="off"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  className="bg-white/50"
                  required
                />
              </Field>
              <Field className="mb-2">
                <Button type="submit" disabled={loading}>
                  {loading && <LoaderCircle className="animate-spin" />}
                  登录
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
