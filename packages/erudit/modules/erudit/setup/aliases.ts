import type { Nuxt } from '@nuxt/schema';

import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';

export async function setupEruditAliases(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    nuxt.options.alias = {
        ...nuxt.options.alias,
        '@erudit': runtimeConfig.paths.package,
        '@erudit/module': runtimeConfig.paths.module,
        '@erudit/app': runtimeConfig.paths.app,
        '@erudit/server': runtimeConfig.paths.server,
        $: runtimeConfig.paths.app + '/styles',
    };
}
