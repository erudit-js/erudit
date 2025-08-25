import type { Nuxt } from '@nuxt/schema';

import type {
    EruditRuntimeConfig,
    EruditPublicRuntimeConfig,
} from '../../../shared/types/runtimeConfig';

export async function setupEruditNuxtConfig(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
    publicRuntimeConfig: EruditPublicRuntimeConfig,
) {
    //
    // Include Erudit package and Erudit project files in TSConfig
    //

    nuxt.options.typescript.tsConfig.include = [
        ...(nuxt.options.typescript.tsConfig.include || []),
        runtimeConfig.paths.package + '/**/*',
        runtimeConfig.paths.project + '/**/*',
    ];

    //
    // Locate `.output` directory in project root
    //

    {
        const outputOptions = (nuxt.options.nitro.output ||= {});
        outputOptions.dir = runtimeConfig.paths.project + '/.output';
        outputOptions.publicDir =
            runtimeConfig.paths.project +
            '/.output/public' +
            publicRuntimeConfig.project.baseUrl;
    }

    //
    // Add Erudit Layer `server` dir to Nuxt server TSConfig
    //

    {
        const nitroTypescript = (nuxt.options.nitro.typescript ||= {});
        nitroTypescript.tsConfig = nitroTypescript.tsConfig || {};
        nitroTypescript.tsConfig.include = [
            ...(nitroTypescript.tsConfig.include || []),
            runtimeConfig.paths.package + '/server/**/*',
        ];
    }
}
