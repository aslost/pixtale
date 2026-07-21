import { Hono } from 'hono';
import { contextStorage } from 'hono/context-storage';
import result from '../model/result';
import { cors } from 'hono/cors';
import BizError from '../error/biz-error';
import { security } from '../security/security';

// 这个模块创建 Hono 应用并注册通用中间件与错误处理。

const app = new Hono().basePath('/api');

app.use('*', cors());
app.use('*', contextStorage());
app.use('*', security);

// 统一处理接口异常并返回约定的响应结构。
app.onError((err, c) => {

  if (err instanceof BizError) {

    if (err.code === 401 || err.code === 403) {
      return c.json(result.fail(err.message, err.code), err.code);
    }

    console.log(err.message);
    return c.json(result.fail(err.message, err.code));
  }

  console.error(err);
  return c.json(result.fail(err.message));
});

export { app };
