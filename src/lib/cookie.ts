import { TOKEN_COOKIE_NAME } from "@/server/const/global"

// 这个模块封装浏览器 Cookie 读取和业务 Cookie 解析。

type LoginCookie = {
  userId: string | null
  uuid: string | null
}

// 从浏览器 Cookie 中读取指定名称的值。
function getCookieValue(name: string) {
  const item = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))

  return item?.slice(name.length + 1)
}

// 从传入的 Cookie 字符串中读取指定名称的值。
function getCookieValueFromString(cookie: string | null | undefined, name: string) {
  if (!cookie) {
    return undefined
  }

  const item = cookie
    .split("; ")
    .find((cookieItem) => cookieItem.startsWith(`${name}=`))

  return item?.slice(name.length + 1)
}

// 从传入的 Cookie 字符串中验证登录 token，并返回用户 id 与会话 uuid。
async function getLoginInfo(cookie: string | null = null): Promise<LoginCookie> {
  const token = getCookieValueFromString(cookie, TOKEN_COOKIE_NAME)
  const { verifyLoginToken } = await import("@/server/lib/jwt")
  const payload = await verifyLoginToken(token)

  return {
    userId: payload?.userId ?? null,
    uuid: payload?.uuid ?? null,
  }
}

export { getCookieValue, getCookieValueFromString, getLoginInfo }
export type { LoginCookie }
