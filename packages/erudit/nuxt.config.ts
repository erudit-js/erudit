import {
    PUBLIC_CONTENT_ASSET,
    PUBLIC_CONTRIBUTOR_ASSET,
    PUBLIC_ERUDIT_ASSET,
    PUBLIC_USER_ASSET,
} from './const';
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
        //
        '#project': projectPath(),
        '#content': projectPath('content'),
    },
    modules: [eruditPath('module'), 'nuxt-my-icons'],
    myicons: {
        iconsDir: eruditPath('app/assets/icons'),
    },
    features: {
        inlineStyles: false,
    },
    typescript: {
        tsConfig: {
            include: [eruditPath('**/*'), projectPath('**/*')],
        },
    },
    build: {
        transpile: [
            'yaml',
            'photoswipe',
            '@bitran-js/renderer-vue',
            '@erudit-js/bitran-elements',
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
            crawlLinks: true,
            failOnError: false,
            concurrency: 10,
            ignore: [
                (path: string) => {
                    const regexps = [/\?element=/gm, /#/gm, /\.json\?/gm];
                    const shouldIgnore = regexps.some((re) => re.test(path));
                    return shouldIgnore;
                },
            ],
        },
        output: {
            publicDir: projectPath('dist'),
        },
        externals: {
            inline: [/bitran-elements/],
        },
        publicAssets: [
            {
                baseURL: PUBLIC_ERUDIT_ASSET,
                dir: eruditPath('app/public'),
                maxAge: 60 * 60 * 24 * 30,
            },
            {
                baseURL: PUBLIC_USER_ASSET,
                dir: projectPath('public'),
                maxAge: 60 * 60 * 24 * 30,
            },
            {
                baseURL: PUBLIC_CONTENT_ASSET,
                dir: projectPath('content'),
                maxAge: 60 * 60 * 24 * 30,
            },
            {
                baseURL: PUBLIC_CONTRIBUTOR_ASSET,
                dir: projectPath('contributors'),
                maxAge: 60 * 60 * 24 * 30,
            },
        ],
        esbuild: {
            options: {
                charset: 'utf8',
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
            include: [
                'yaml',
                'photoswipe',
                '@floating-ui/vue',
                '@bitran-js/core',
                '@bitran-js/transpiler',
                '@bitran-js/renderer-vue',
                '@erudit-js/bitran-elements',
            ],
        },
        server: {
            fs: { strict: false },
        },
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
