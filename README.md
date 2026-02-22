<p align="center" style="text-align: center;">
    <img src="./packages/erudit/public/logotype.svg" width="100px" />
</p>

# Erudit

Erudit is a CMS for perfect community-driven educational sites:

- Content is written in **JSX/TSX** using custom DSL tags like `<P>`, `<Problem>`, `<Flex>` and many more provided by [`@erudit-js/prose`](https://github.com/erudit-js/erudit/tree/main/packages/prose) package and powered by [`tsprose`](https://github.com/Gwynerva/tsprose).
- **Type-safe cross-references** with automatic generation of tables of contents, search indexes, and content dependencies.
- Full **TypeScript power**: variables, functions, type-safe tag props, and more.
- Nuxt-powered **fully static** (no server required) site with **adaptive design** (looks good on both mobile and desktop).

## Minimal Example

Create empty folder, install `erudit` package and run preparation script:

```bash
npm install erudit
npx erudit prepare
```

For a smoother writing experience, I suggest building the project first:

```bash
npx erudit build
```

This command needs to be run **only once!**<br>
Run it again if you change `erudit.config.ts` or after updating the Erudit package.

That’s it!
Start writing content in the `content` folder.
You can further customize the project by editing `erudit.config.ts`.

To preview your content changes live, run:

```bash
npx erudit launch
```

This starts a local web server with a live preview of your content at `http://localhost:3000`.

To generate and preview a fully static site, run:

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
2. Install [Bun](https://bun.sh/) if you don't have it already
3. Run `bun install` to install dependencies
4. Run `bun build` to build all packages (`core`, `cli`, `prose`, except `erudit` as it is a Nuxt Layer)

Now the project is ready for your edits.
Try out your changes using the playground Erudit project in the `playground` directory.

Commands to control the playground Erudit project (run from the repository root):

```bash
bun play

bun play:prepare

bun play:build
bun play:launch

bun play:generate
bun play:preview
```
