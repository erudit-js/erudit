import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';

const currentDir = dirname(fileURLToPath(import.meta.url));

/**
 * This is context-unaware or "static" Nuxt configuration.
 * The only thing that works here are aliases.
 * If you need to use context (e.g. paths to package/project or Erudit project config), use `./modules/erudit/setup/nuxtConfig.ts` file.
 */
export default defineNuxtConfig({
    compatibilityDate: '2025-07-20',
    devtools: { enabled: true },
    $meta: { name: 'erudit' },
    modules: [currentDir + '/modules/erudit', 'nuxt-my-icons'],
    css: ['@erudit/app/styles/main.css'],
    myicons: {
        iconsDir: '@erudit/app/assets/icons',
    },
    plugins: ['@erudit/app/plugins/appSetup'],
    nitro: {
        plugins: ['@erudit/server'],
        esbuild: {
            options: {
                charset: 'utf8',
            },
        },
        typescript: {
            tsConfig: {
                compilerOptions: {
                    verbatimModuleSyntax: true,
                },
            },
        },
        // @see https://github.com/nitrojs/nitro/issues/3565
        //
        // externals: {
        //     trace: true,
        //     traceInclude: ['@erudit-js/prose'],
        // },
        rollupConfig: {
            external(source) {
                const ignore = ['jiti'];

                for (const ignoreItem of ignore) {
                    if (source.includes(ignoreItem)) {
                        return true;
                    }
                }
            },
        },
    },
    vite: {
        plugins: [
            tailwindcss(),
            {
                // Remove when this is fixed: https://github.com/tailwindlabs/tailwindcss/discussions/16119
                apply: 'build',
                name: 'vite-plugin-ignore-sourcemap-warnings',
                configResolved(config) {
                    const originalOnWarn = config.build.rollupOptions.onwarn;
                    config.build.rollupOptions.onwarn = (warning, warn) => {
                        if (
                            warning.code === 'SOURCEMAP_BROKEN' &&
                            warning.plugin ===
                                '@tailwindcss/vite:generate:build'
                        ) {
                            return;
                        }

                        if (originalOnWarn) {
                            originalOnWarn(warning, warn);
                        } else {
                            warn(warning);
                        }
                    };
                },
            },
        ],
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
                '@floating-ui/vue',
                'perfect-debounce',
                'flexsearch',
            ],
        },
        server: {
            fs: { strict: false },
        },
    },
});
