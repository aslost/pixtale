import { orm } from '@/server/infra/db'
import { userTab } from "@/server/entity/user";
import { eq } from "drizzle-orm";
import BizError from "@/server/error/biz-error";
import { verifyPassword } from '@/server/lib/crypto';
import { createId } from '@/server/lib/id';
import { createLoginToken } from '@/server/lib/jwt';
import { type LoginBo } from '@/server/entity/bo/login';
import { type AuthInfo } from '@/server/entity/vo/auth';
import { UserStatusEnum } from '@/server/enums/user-enum';
import { cache } from '@/server/infra/cache';
import { AUTH_CACHE_TTL } from '@/server/const/global';
import { AUTH_CACHE_KEY } from '@/server/const/cache';

// 这个模块处理登录认证相关业务。

const loginService = {

  // 把用户信息写入登录缓存，并返回本次会话 uuid。
  async saveAuthInfo(user: { userId: string, username: string, avatar: string, type: number }): Promise<string> {
    const uuid = createId()
    const oldAuthInfo = await cache.get<AuthInfo>(AUTH_CACHE_KEY + user.userId)

    const authInfo: AuthInfo = {
      userId: user.userId,
      username: user.username,
      avatar: user.avatar,
      type: user.type,
      uuidList: oldAuthInfo ? [...oldAuthInfo.uuidList, uuid] : [uuid],
    }

    await cache.set(AUTH_CACHE_KEY + user.userId, authInfo, { ttl: AUTH_CACHE_TTL })
    return uuid
  },

  // 校验用户名和密码，登录成功后生成 JWT。
  async login(params: LoginBo): Promise<string> {

    if (!params.username?.trim() || !params.password?.trim()) {
      throw new BizError("login.credentialsRequired");
    }

    const [user] = await orm.select().from(userTab).where(eq(userTab.username, params.username)).limit(1);

    if (!user) {
      throw new BizError("login.invalidCredentials");
    }

    if (user.status === UserStatusEnum.DISABLE) {
      throw new BizError("user.disabled");
    }

    const isValidPassword = await verifyPassword(params.password, user.salt, user.password);

    if (!isValidPassword) {
      throw new BizError("login.invalidCredentials");
    }

    if (user.username === process.env.NEXT_PUBLIC_DEMO_USERNAME) {
      return createLoginToken(user.userId, 'demo');
    }

    const uuid = await this.saveAuthInfo(user);
    return createLoginToken(user.userId, uuid);
  },

  // 退出登录时从缓存移除当前会话 uuid。
  async logout(userId: string | null, uuid: string | null): Promise<void> {

    if (!userId || !uuid) {
      return
    }

    const authInfo = await cache.get<AuthInfo>(AUTH_CACHE_KEY + userId)

    if (!authInfo) {
      return
    }

    const uuidList = authInfo.uuidList.filter((item) => item !== uuid)

    if (!uuidList.length) {
      await cache.delete(AUTH_CACHE_KEY + userId)
      return
    }

    await cache.set(AUTH_CACHE_KEY + userId, {
      ...authInfo,
      uuidList,
    }, { ttl: AUTH_CACHE_TTL })
  },

}

export { loginService }
