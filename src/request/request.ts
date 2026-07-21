import { toast } from "sonner";

// 这个模块封装前端 HTTP 请求。

interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T | null;
}

type RequestParams = object | FormData | null;

const MOCK_REQUEST_DELAY = 0;

// 等待指定毫秒数，用于模拟线上接口耗时。
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// 拼接接口基础地址。
function buildUrl(url: string) {
  return url.startsWith('/api') ? url : `/api${url.startsWith('/') ? url : `/${url}`}`;
}

// 处理身份失效并跳转登录页。
function handleUnauthorized() {
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}

// 发送 POST 请求并返回接口 data。
async function post<T = unknown>(url: string, params: RequestParams = null) {
  const headers = new Headers();
  let body: BodyInit | null = null;

  if (params instanceof FormData) {
    body = params;
  } else if (params) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(params);
  }

  await sleep(MOCK_REQUEST_DELAY);

  const res = await fetch(buildUrl(url), {
    method: 'POST',
    headers,
    body,
    credentials: 'include'
  });
  const json = await res.json() as ApiResponse<T>;

  if (!res.ok || json.code !== 200) {
    const message = json.message || '请求失败';
    toast.error(message);

    if (res.status === 401 || json.code === 401) {
      handleUnauthorized();
    }

    throw new Error(message);
  }

  return json.data as T;
}

const http = {
  // 发送 POST 请求。
  post<T = unknown>(url: string, params: RequestParams = null) {
    return post<T>(url, params);
  }
};

export { http };
export type { ApiResponse, RequestParams };
