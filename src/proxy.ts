import { NextResponse, type NextRequest } from 'next/server';
import { TOKEN_COOKIE_NAME } from '@/server/const/global';
import { AUTH_CACHE_KEY } from '@/server/const/cache';
import { getLoginInfo } from '@/lib/cookie';
import { UserTypeEnum } from '@/server/enums/user-enum';
import { type AuthInfo } from '@/server/entity/vo/auth';
import { cache } from '@/server/infra/cache';

// 这个模块代理页面路由，未登录时跳转登录页。

const SYSTEM_PATHS = ['/users', '/settings', '/storage'];
const PUBLIC_FILE_REG = /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/i;

// 判断当前路径是否允许未登录访问。
function isPublicPath(pathname: string) {
  return pathname.startsWith('/login')
    || pathname.startsWith('/api')
    || pathname.startsWith('/media')
    || pathname.startsWith('/_next')
    || pathname === '/favicon.ico'
    || pathname === '/robots.txt'
    || PUBLIC_FILE_REG.test(pathname);
}

// 判断当前路径是否命中指定页面或其子页面。
function isPathMatched(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

// 判断当前路径是否属于系统设置页面。
function isSystemPath(pathname: string) {
  return SYSTEM_PATHS.some((path) => isPathMatched(pathname, path));
}

// 清除登录相关 Cookie，并返回传入响应。
function clearLoginCookies(response: NextResponse) {
  response.cookies.set(TOKEN_COOKIE_NAME, '', {
    path: '/',
    maxAge: 0,
  });

  return response;
}

// 代理未登录页面访问，API 和媒体资源交给各自后端处理。
export async function proxy(req: NextRequest) {

  const { pathname } = req.nextUrl;
  const cookie = req.headers.get('cookie');
  const { userId, uuid } = await getLoginInfo(cookie);

  if (!userId || !uuid) {
    if (isPublicPath(pathname)) {
      return clearLoginCookies(NextResponse.next());
    }

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return clearLoginCookies(NextResponse.redirect(loginUrl));
  }

  // 从缓存确认当前会话 uuid 仍有效。
  const authInfo = await cache.get<AuthInfo>(AUTH_CACHE_KEY + userId);

  if (!authInfo || !authInfo.uuidList.includes(uuid)) {
    if (isPublicPath(pathname)) {
      return clearLoginCookies(NextResponse.next());
    }

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return clearLoginCookies(NextResponse.redirect(loginUrl));
  }

  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/photos';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/login')) {
    const photoUrl = req.nextUrl.clone();
    photoUrl.pathname = '/photos';
    return NextResponse.redirect(photoUrl);
  }

  if (isSystemPath(pathname) && authInfo.type !== UserTypeEnum.ADMIN) {
    const notFoundUrl = req.nextUrl.clone();
    notFoundUrl.pathname = '/_not-found';

    return NextResponse.rewrite(notFoundUrl, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|media|_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)'],
};
