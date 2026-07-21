import type { Context, Next } from 'hono';
import { deleteCookie, getCookie } from 'hono/cookie';
import { TOKEN_COOKIE_NAME } from '@/server/const/global';
import BizError from '@/server/error/biz-error';
import { verifyLoginToken } from '@/server/lib/jwt';
import { setUserId } from '@/server/security/context';
import { userService } from '@/server/service/user-service';
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

// 校验 JWT，通过后把 userId 写入上下文；公开路径直接放行。
async function security(c: Context, next: Next) {

  const path = c.req.path.replace(/^\/api/, '');

  if (path.startsWith('/login')) {
    return next();
  }

  const payload = await verifyLoginToken(getCookie(c, TOKEN_COOKIE_NAME));

  if (!payload?.userId) {
    clearLoginCookies(c);
    throw new BizError('身份认证失败', 401);
  }

  setUserId(payload.userId);

  if (isSystemPath(path)) {
    const user = await userService.getById(payload.userId);

    if (user?.type === UserTypeEnum.NORMAL) {
      throw new BizError('权限不足', 403);
    }
  }

  return next();
}

export { security };
