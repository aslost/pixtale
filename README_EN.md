<p align="center">
        <img src="docs/images/logo.png" width="96px" />
    <h1 align="center">Pixtale</h1>
    <p align="center"><strong>A photo storage application with a masonry gallery</strong></p>
    <p align="center"><a href="README.md">简体中文</a> | English</p>
</p>

## Preview

- [Live Demo](https://demo.mornglow.top)

![](docs/images/demo.jpg)
![](docs/images/demo1.jpg)
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

```bash
docker run \
  --name pixtale \
  -p 8082:8082 \
  -v /home/pixtale:/app/data \
  -e ADMIN=root \
  -e PASSWORD=123456 \
  -e JWT_SECRET=abc \
  pixtalelab/pixtale:latest
```

Replace `ADMIN`, `PASSWORD`, and `JWT_SECRET` with your own secure values, then run the command.

### Local Development

#### Requirements

- Nodejs 24+


#### Install Dependencies

```yaml
pnpm i
```

#### Configure Environment

```yaml
cp .env.example .env
```

#### Start the Dev Server

```yaml
pnpm run dev
```

## Environment Variables

| Variable     | Required | Default | Description              |
|--------------|----------|---------|--------------------------|
| `ADMIN`      | ✅        | None    | Administrator username   |
| `PASSWORD`   | ✅        | None    | Administrator password   |
| `JWT_SECRET` | ✅        | None    | Secret used to sign JWTs |
| `TITLE`      | ❌        | Pixtale | Website title            |

## License

`Pixtale` is open-source software licensed under the [AGPL-3.0](LICENSE).
