import type { Context, Next } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { TOKEN_COOKIE_NAME } from '@/server/const/global';
import { AUTH_CACHE_KEY } from '@/server/const/cache';
import BizError from '@/server/error/biz-error';
import { getLoginInfo } from '@/lib/cookie';
import { setUserId } from '@/server/security/context';
import { cache } from '@/server/infra/cache';
import { type AuthInfo } from '@/server/entity/vo/auth';
import { UserTypeEnum } from '@/server/enums/user-enum';

// 这个模块提供全局接口鉴权中间件。

const SYSTEM_PATHS = [
  '/setting',
  '/user/list',
  '/user/add',
  '/user/set',
  '/user/toggleStatus',
  '/user/delete',
  '/storage/list',
  '/storage/add',
  '/storage/set',
  '/storage/setTop',
  '/storage/toggleStatus',
  '/storage/delete'
];

// 判断当前路径是否命中指定接口或其子路径。
function isPathMatched(path: string, target: string) {
  return path === target || path.startsWith(`${target}/`);
}

// 判断当前接口是否属于系统管理接口。
function isSystemPath(path: string) {
  return SYSTEM_PATHS.some((target) => isPathMatched(path, target));
}

// 清除登录相关 Cookie。
function clearLoginCookies(c: Context) {
  deleteCookie(c, TOKEN_COOKIE_NAME, {
    path: '/',
  });
}

// 校验登录信息与会话 uuid，通过后写入上下文；公开路径直接放行。
async function security(c: Context, next: Next) {

  const path = c.req.path.replace(/^\/api/, '');

  if (path.startsWith('/login') || path.startsWith('/logout')) {
    return next();
  }

  const { userId, uuid } = await getLoginInfo(c.req.header('cookie') ?? null);

  if (!userId || !uuid) {
    clearLoginCookies(c);
    throw new BizError('auth.failed', 401);
  }

  // 从缓存读取登录信息，并确认当前 uuid 仍有效。
  const authInfo = await cache.get<AuthInfo>(AUTH_CACHE_KEY + userId);

  if (!authInfo || !authInfo.uuidList.includes(uuid)) {
    clearLoginCookies(c);
    throw new BizError('auth.failed', 401);
  }

  if (isSystemPath(path) && authInfo.type === UserTypeEnum.NORMAL) {
    throw new BizError('auth.forbidden', 403);
  }

  setUserId(authInfo.userId);

  return next();
}

export { security };
