import { orm } from '@/server/infra/db'
import { userTab } from "@/server/entity/user";
import { count, eq } from "drizzle-orm";
import BizError from "@/server/error/biz-error";
import { verifyPassword } from '@/server/lib/crypto';
import { createLoginToken } from '@/server/lib/jwt';
import { type LoginBo } from '@/server/entity/bo/login';
import { UserStatusEnum, UserTypeEnum } from '@/server/enums/user-enum';
import { userService } from '@/server/service/user-service';

// 这个模块处理登录认证相关业务。

const loginService = {

  // 校验用户名和密码，登录成功后生成 JWT。
  async login(params: LoginBo): Promise<string> {

    if (!params.username?.trim() || !params.password?.trim()) {
      throw new BizError("用户名和密码不能为空");
    }

    const [user] = await orm.select().from(userTab).where(eq(userTab.username, params.username)).limit(1);

    if (!user) {

      const token = await this.initFirstUserLogin(params);

      if (token) {
        return token;
      }

      throw new BizError("用户名或密码错误");
    }

    if (user.status === UserStatusEnum.DISABLE) {
      throw new BizError("用户已被禁用");
    }

    const isValidPassword = await verifyPassword(params.password, user.salt, user.password);

    if (!isValidPassword) {
      throw new BizError("用户名或密码错误");
    }

    return createLoginToken(user.userId);
  },

  // 首次启动且用户表为空时，用当前登录信息创建管理员并返回 token。
  async initFirstUserLogin(params: LoginBo): Promise<string | null> {

    const [stat] = await orm
      .select({ total: count() })
      .from(userTab);

    if (Number(stat?.total ?? 0) !== 0) {
      return null;
    }

    const username = params.username.trim();
    const password = params.password.trim();

    await userService.add({
      username,
      password,
      type: UserTypeEnum.ADMIN,
    });

    const [user] = await orm
      .select()
      .from(userTab)
      .where(eq(userTab.username, username))
      .limit(1);

    if (!user) {
      throw new BizError('Failed to initialize user');
    }

    return createLoginToken(user.userId);
  },

}

export { loginService }
