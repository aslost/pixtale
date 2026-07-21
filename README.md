This is a [Next.js](https://nextjs.org) web album project.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy

Build and run with Docker:

```bash
docker build -t album .
docker run -p 3000:3000 album
```

Or build standalone output locally:

```bash
pnpm build
node .next/standalone/server.js
```
