import { getContext } from 'hono/context-storage';

// 这个模块读写当前请求登录用户 id。

interface ContextEnv {
  Variables: {
    userId: string;
  }
}

// 把当前请求登录用户 id 写入 Hono 请求上下文。
function setUserId(userId: string) {
  getContext<ContextEnv>().set('userId', userId);
}

// 从 Hono 请求上下文读取当前请求登录用户 id。
function getUserId(): string {
  return getContext<ContextEnv>().get('userId') ?? '';
}

export { getUserId, setUserId };
