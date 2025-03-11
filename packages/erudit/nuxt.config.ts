//import { elementPackages } from '@erudit-js/bitran-elements';

import { eruditPath, projectPath } from './globalPath';

export default defineNuxtConfig({
    compatibilityDate: '2025-01-01',
    devtools: { enabled: true },
    future: { compatibilityVersion: 4 },
    ssr: true,
    alias: {
        '@erudit': eruditPath(),
        '@module': eruditPath('module'),
        '@server': eruditPath('server/plugin'),
        '@shared': eruditPath('shared'),
        '@app': eruditPath('app'),
        $: eruditPath('app/styles'),
    },
    modules: [eruditPath('module'), 'nuxt-my-icons'],
    myicons: {
        iconsDir: eruditPath('app/assets/icons'),
    },
    typescript: {
        tsConfig: {
            include: [eruditPath('**/*'), projectPath('**/*')],
        },
    },
    // modulesDir: [
    //     'D:/code/erudit-js/erudit/node_modules',
    //     'D:/code/erudit-js/bitran-elements/node_modules',
    // ],
    build: {
        transpile: [
            'yaml',
            '@bitran-js/renderer-vue',
            '@erudit-js/bitran-elements',
            // '@bitran-js/renderer-vue',
            // // '@erudit-js/bitran-elements',
            // // '@erudit-js/bitran-elements/heading/renderer',
            // 'yaml',
            //...elementPackages,
            // (ctx) => (ctx.isClient ? 'slugify' : false),
            // 'katex',
            // '@bitran-js/core',
            // '@bitran-js/transpiler',
            // '@bitran-js/renderer-vue',
            // '@erudit-js/bitran-elements',
            // '@erudit-js/bitran-elements/heading/shared',
            // '@erudit-js/bitran-elements/heading/transpiler',
            // '@erudit-js/bitran-elements/heading/renderer',
        ],
    },
    ignore: [
        // Content assets
        ...[
            '**/{book,group,topic}.{js,ts}',
            '**/{article,summary,practice,content}.bi',
        ].map((pattern) => projectPath(`content/${pattern}`)),
        // Contributors assets
        ...['*/contributor.{js,ts}', '*/description.bi'].map((pattern) =>
            projectPath(`contributors/${pattern}`),
        ),
    ],
    nitro: {
        preset: 'github-pages',
        plugins: [eruditPath('server/plugin')],
        prerender: {
            failOnError: false,
        },
        output: {
            publicDir: projectPath('dist'),
        },
        publicAssets: [
            {
                baseURL: '/_erudit-asset/',
                dir: eruditPath('app/public'),
                maxAge: 60 * 60 * 24 * 30,
            },
            {
                baseURL: '/_user-asset/public/',
                dir: projectPath('public'),
                maxAge: 60 * 60 * 24 * 30,
            },
            {
                baseURL: '/_user-asset/content/',
                dir: projectPath('content'),
                maxAge: 60 * 60 * 24 * 30,
            },
            {
                baseURL: '/_user-asset/contributor/',
                dir: projectPath('contributors'),
                maxAge: 60 * 60 * 24 * 30,
            },
        ],
        esbuild: {
            options: {
                tsconfigRaw: {
                    compilerOptions: {
                        experimentalDecorators: true, // Make TypeORM work with Nuxt,
                    },
                },
            },
        },
    },
    vite: {
        optimizeDeps: {
            noDiscovery: true,
            include: [
                'yaml',
                '@floating-ui/vue',
                // '@bitran-js/core',
                // '@bitran-js/transpiler',
                // // '@bitran-js/renderer-vue',
                // // '@erudit-js/bitran-elements',
                // 'gradient-string',
                // '@floating-ui/vue',
                // 'yaml',
                // //
                //...elementPackages,
                // '@bitran-js/core',
                // '@bitran-js/transpiler',
                // '@bitran-js/renderer-vue',
                // '@erudit-js/bitran-elements',
                // '@erudit-js/bitran-elements/heading/shared',
                // '@erudit-js/bitran-elements/heading/transpiler',
                // '@erudit-js/bitran-elements/heading/renderer',
            ],
        },
        server: { fs: { strict: false } },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    additionalData: `@use '$/utils' as *;`,
                },
            },
        },
    },
});
