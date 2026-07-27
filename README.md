<p align="center">
    <img src="docs/images/logo.png" width="96px" />
    <h1 align="center">Pixtale</h1>
    <p align="center"><strong>一个瀑布流列表照片空间存储程序 🎉</strong></p>
    <p align="center">简体中文 | <a href="README_EN.md">English</a></p>
</p>

## 项目展示

- [在线演示](https://demo.mornglow.top)

![](docs/images/demo.jpg)
![](docs/images/demo1.jpg)


## 功能介绍

- **🖼️ 瀑布流列表**：瀑布流无限滚动，采用游标分页+虚拟滚动优化性能

- **🌄 缩略图优化**：生成缩略图和高清图，优化在弱网环境下的体验

- **📷 EXIF解析**：解析记录照片EXIF信息，按时间线排列照片

- **💻 响应式设计**：响应式布局自动适配PC和大部分手机端浏览器

- **☁️ 聚合存储**：支持本地文件和S3协议对象存储，聚合式存储图片

- **👥 多用户**：支持添加不同用户，提供多用户使用支持与管理


## 技术栈

- **全栈框架：** [Next.js](https://nextjs.org/)

- **Web框架：** [Hono](https://hono.dev/)

- **ORM：** [Drizzle](https://orm.drizzle.team/)

- **数据库：** [SQLite](https://sqlite.org/)

- **UI组件：** [shadcn/ui](https://ui.shadcn.com/)

## 快速部署

#### Docker部署

```yaml
docker run \
  --name pixtale \
  -p 8082:8082 \
  -v /home/pixtale:/app/data \
  -e ADMIN=root \
  -e PASSWORD=123456 \
  -e JWT_SECRET=abc \
  pixtalelab/pixtale:latest
```

把上面的 `ADMIN` `PASSWORD` `JWT_SECRET` 改成你自己的，然后运行

### 本地开发

#### 环境要求 

- Nodejs 24+


#### 安装依赖

```yaml
pnpm i
```

#### 配置环境

```yaml
cp .env.example .env
```

#### 启动服务

```yaml
pnpm run dev
```

## 环境变量

| 变量         | 必填 | 默认值     | 说明    |
|------------|----|---------|-------|
| ADMIN      | ✅  | 空       | 管理员账号 |
| PASSWORD   | ✅  | 空       | 管理员密码 |
| JWT_SECRET | ✅  | 空       | JWT密钥 |
| TITLE      | ❌  | Pixtale | 网站标题  |

## 许可证

`Pixtale` 是基于 [AGPL-3.0](LICENSE) 许可证的开源软件




