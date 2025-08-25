import type { Nuxt } from '@nuxt/schema';

import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';
import {
    PUBLIC_ERUDIT_BASE_URL,
    PUBLIC_PROJECT_BASE_URL,
} from '../globals/public';

export async function setupEruditPublicAssets(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    const nitro = nuxt.options.nitro;
    const nitroPublicAssets = (nitro.publicAssets ||= []);
    const nitroModules = (nitro.modules ||= []);

    // Clear default Nuxt/Nitro public assets
    nitroModules.push((nitro) => {
        nitro.options.publicAssets = nitro.options.publicAssets?.filter(
            (item) => {
                const wantsToCopyToRoot = item.baseURL === '/';
                const fromPackagePublic =
                    item.dir === runtimeConfig.paths.package + '/public';
                const fromProjectPublic =
                    item.dir === runtimeConfig.paths.project + '/public';

                if (
                    wantsToCopyToRoot &&
                    (fromPackagePublic || fromProjectPublic)
                ) {
                    return false;
                }

                return true;
            },
        );
    });

    // Adding Erudit package and project public assets
    nitroPublicAssets.push(
        {
            baseURL: PUBLIC_ERUDIT_BASE_URL,
            dir: runtimeConfig.paths.package + '/public',
            maxAge: 60 * 60 * 24 * 365,
        },
        {
            baseURL: PUBLIC_PROJECT_BASE_URL,
            dir: runtimeConfig.paths.project + '/public',
            maxAge: 60 * 60 * 24 * 365,
        },
    );
}
