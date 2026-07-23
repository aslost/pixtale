import { cookies } from "next/headers"
import { UserProvider } from "@/app/users/provider"
import { getLoginInfo } from "@/lib/cookie"
import { userService } from "@/server/service/user-service"

interface UserLayoutProps {
  children: React.ReactNode
}

// 服务端查询用户列表，并提供给 /user 页面初始化表格。
export default async function UserLayout({ children }: UserLayoutProps) {
  const cookieStore = await cookies()
  const { userId } = await getLoginInfo(cookieStore.toString())

  if (!userId) {
    return null
  }

  const data = await userService.list()

  return (
    <UserProvider initialUserList={data.list}>
      {children}
    </UserProvider>
  )
}
