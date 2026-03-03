import tailwindcss from '@tailwindcss/vite';
import { sn } from 'unslash';

import { BASE_URL, ERUDIT_COMMAND, PROJECT_PATH } from './modules/erudit/env';

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
  typescript: {
    nodeTsConfig: {
      include: [sn(PROJECT_PATH, 'packages/erudit/modules/erudit/**/*.ts')],
    },
  },
  runtimeConfig: {
    eruditPath: '',
    projectPath: '',
    contentTargets: '',
    public: {
      eruditVersion: '',
      eruditMode: '',
      eruditReload: true,
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
      // Prevent inlining some packages
      external(source) {
        const ignore = ['jiti', 'tsprose'];

        for (const ignoreItem of ignore) {
          if (source.includes(ignoreItem)) {
            return true;
          }
        }
      },
    },
    output: {
      dir: sn(PROJECT_PATH, '.output'),
      publicDir: sn(PROJECT_PATH, '.output/public', BASE_URL || ''),
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
              warning.plugin === '@tailwindcss/vite:generate:build'
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
        'unslash',
        'tsprose',
        'tsprose/jsx-runtime',
      ],
    },
    server: {
      fs: { strict: false },
    },
  },
});
