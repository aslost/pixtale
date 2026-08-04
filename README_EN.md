<p align="center">
        <img src="https://img.022335.xyz/logo.png" width="96px" />
    <h1 align="center">Pixtale</h1>
    <p align="center"><strong>A masonry-style web photo album built with Next.js</strong></p>
    <p align="center"><a href="README.md">简体中文</a> | English</p>
</p>

## Preview

- [Live Demo](https://022335.xyz)

![](https://img.022335.xyz/demo.jpg)
![](https://img.022335.xyz/demo1.jpg)
## Features

- **🖼️ Masonry Gallery:** Browse photos with infinite scrolling, cursor-based pagination, and virtualized rendering.

- **🌄 Optimized Thumbnails:** Generate thumbnails and high-resolution previews for a smoother experience on slower networks.

- **📷 EXIF Metadata:** Parse photo EXIF metadata and arrange photos on a chronological timeline.

- **💻 Responsive Design:** Automatically adapts to desktop and most mobile browsers.

- **☁️ Unified Storage:** Store photos on the local filesystem or S3-compatible object storage and browse them in one place.

- **👥 Multi-user Support:** Add and manage multiple user accounts.

## Tech Stack

- **Full-stack Framework:** [Next.js](https://nextjs.org/)

- **Web Framework:** [Hono](https://hono.dev/)

- **ORM:** [Drizzle](https://orm.drizzle.team/)

- **Database:** [SQLite](https://sqlite.org/)

- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

## Quick Deployment

### Docker

Replace ADMIN, PASSWORD, and JWT_SECRET with your own values, then run:
```bash
docker run -d \
  --name pixtale \
  -p 8082:8082 \
  -v /home/pixtale/data:/app/data \
  -e ADMIN=admin \
  -e PASSWORD=123456 \
  -e JWT_SECRET=abc \
  aslost/pixtale:latest
```
Then visit http://ip:8082

### Windows

Download `pixtale-win.zip` from [Releases](https://github.com/aslost/pixtale/releases), extract it, configure `.env`, then double-click `start.bat` to start.

## Environment Variables

| Variable     | Required | Default | Description              |
|--------------|----------|---------|--------------------------|
| `ADMIN`      | ✅        | None    | Administrator username   |
| `PASSWORD`   | ✅        | None    | Administrator password   |
| `JWT_SECRET` | ✅        | None    | Secret used to sign JWTs |
| `TITLE`      | ❌        | Pixtale | Website title            |

## Friend Links
[LINUXDO](https://linux.do)

## License

`Pixtale` is open-source software licensed under the [AGPL-3.0](LICENSE).
