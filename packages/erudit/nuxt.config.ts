import tailwindcss from '@tailwindcss/vite';
import { sn } from 'unslash';

import { BASE_URL, ERUDIT_COMMAND, PROJECT_PATH } from './modules/erudit/env';

/**
 * This is context-unaware or "static" Nuxt configuration.
 * The only thing that works here are aliases.
 * If you need to use context (e.g. paths to package/project or Erudit project config), use `./modules/erudit/setup/nuxtConfig.ts` file.
 */
export default defineNuxtConfig({
    compatibilityDate: '2026-01-01',
    devtools: { enabled: true },
    $meta: { name: 'erudit' },
    modules: ['#layers/erudit/modules/erudit', 'nuxt-my-icons'],
    css: ['#layers/erudit/app/styles/main.css'],
    myicons: {
        iconsDir: '#layers/erudit/app/assets/icons',
    },
    plugins: ['#layers/erudit/app/plugins/appSetup'],
    runtimeConfig: {
        eruditPath: '',
        projectPath: '',
        contentTargets: '',
        public: {
            eruditVersion: '',
            eruditMode: '',
            siteUrl: '',
        },
    },
    nitro: {
        plugins: ['#layers/erudit/server/erudit'],
        prerender:
            ERUDIT_COMMAND === 'build'
                ? undefined
                : {
                      crawlLinks: false,
                      routes: ['/'],
                  },
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
        rollupConfig: {
            // Prevent inlining some packages to avoid singleton and Symbol duplication issues
            external(source) {
                const ignore = ['jiti', '@jsprose'];

                for (const ignoreItem of ignore) {
                    if (source.includes(ignoreItem)) {
                        return true;
                    }
                }
            },
        },
        output: {
            dir: sn(PROJECT_PATH!, '.output'),
            publicDir: sn(PROJECT_PATH!, '.output/public', BASE_URL || ''),
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
            noDiscovery: true,
        },
        server: {
            fs: { strict: false },
        },
    },
});
