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
            '@erudit-js/core/': rel('./src/'),
        },
    },
});
