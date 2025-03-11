<p align="center" style="text-align: center;">
    <img src="./.repository/logotype.svg" width="100px" />
</p>

# Erudit

Erudit is a CMS for perfect community-driven educational sites.

🚧 **This project is under heavy development!**

## Getting Started

Intall `erudit` and `erudit-cli` packages:

```bash
npm install erudit erudit-cli
```

(Optinally) Create `erudit.ts` file to configure your Erudit project:

```ts
export default defineEruditConfig({
    language: 'ru',
    site: {
        title: 'My Awesome Site',
    },
});
```

Use commands provided by Erudit CLI to control your project:

```bash
npm erudit-cli dev|build|preview
```

## Monorepo Structure

- `package/cog` — Erudit types and schemas
- `package/kit` — useful utilities
- `package/erudit` — Erudit app in form of Nuxt Layer

## Local Development

1. Fork `erudit-js/erudit` repository to your GitHub account and then clone it to your local device
2. Install [Bun](https://bun.sh/) if you does not have it already
3. Run `bun install` and then `bun build`

Now the project is ready for your edits.
Try your changes using playground Erudit project located in `playground` directory.

Commands to control playground Erudit project:

```bash
bun play
bun play:prepare
bun play:build
bun play:preview
```
