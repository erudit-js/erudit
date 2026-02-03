import { defineConfig } from 'vitest/config';

function rel(path: string) {
  return new URL(path, import.meta.url).pathname;
}

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.test.json',
    },
  },
  resolve: {
    alias: {
      '@erudit-js/prose/shared/': rel('./src/shared/'),
      '@erudit-js/prose/elements': rel('./src/elements'),
      '@erudit-js/prose': rel('./src/index.ts'),
    },
  },
});
