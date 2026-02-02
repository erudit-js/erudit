<p align="center" style="text-align: center;">
    <img src="./.repository/logotype.svg" width="100px" />
</p>

# Erudit

Erudit is a CMS for perfect community-driven educational sites:

- Content is written in **JSX/TSX** using custom DSL tags (like `<P>`, `<Problem>`, `<Flex>` and many more) provided by [`@jsprose/core`](https://github.com/jsprose/core) package.
- Type strict **cross-references** with automatic generation of tables of contents, search indexes and content dependencies.
- Full **TypeScript power**: variables, functions, type-safe tag props and many more.
- Nuxt-powered **fully static** (no server required) site with **adaptive design** (looks good on both mobile and desktop).

## Minimal Example

Create empty folder, install `erudit` package and run preparation script:

```bash
npm install erudit
npx erudit prepare
```

For comfortable content writing I suggest you to build the project first:

```bash
npx erudit build
```

This command needs to be run **only once!**<br>
Rerun it when you make changes to `erudit.config.ts` file or after updating Erudit package.

That is all!
Start writing content in `content` folder!
You can further customize the project by editing `erudit.config.ts` file!

To preview your content changes live run:

```bash
npx erudit launch
```

This will start local web server with live preview of your content at `http://localhost:3000`.

To generate and preview fully static site run these:

```bash
npx erudit generate
npx erudit preview
```

## Monorepo Structure

- `packages/core` — Erudit types, schemas, tools
- `packages/cli` — CLI for running, building and previewing Erudit projects
- `packages/prose` — custom JSX DSL with collection of default and pluggable elements
- `packages/erudit` — Erudit Nuxt Layer (watches content, builds it and serves site)

## Local Development

1. Fork `erudit-js/erudit` repository to your GitHub account and then clone it to your local device
2. Install [Bun](https://bun.sh/) if you does not have it already
3. Run `bun install` to install dependencies
4. Run `bun build` to build all packages (`core`, `cli`, `prose`, except `erudit` as it is a Nuxt Layer)

Now the project is ready for your edits.
Try your changes using playground Erudit project located in `playground` directory.

Commands to control playground Erudit project (launch from repository root):

```bash
bun play

bun play:prepare

bun play:build
bun play:launch

bun play:generate
bun play:preview
```
