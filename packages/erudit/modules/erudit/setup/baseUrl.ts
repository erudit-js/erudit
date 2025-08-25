import type { Nuxt } from '@nuxt/schema';
import { updateTemplates } from 'nuxt/kit';

import type { EruditPublicRuntimeConfig } from '../../../shared/types/runtimeConfig';

export async function setupEruditCustomBaseUrl(
    nuxt: Nuxt,
    publicRuntimeConfig: EruditPublicRuntimeConfig,
) {
    const newBaseUrl = publicRuntimeConfig.project.baseUrl;

    if (newBaseUrl === '/') {
        return;
    }

    nuxt.options.app.baseURL = newBaseUrl;
    nuxt.options.nitro.runtimeConfig!.app!.baseURL = newBaseUrl;
    await updateTemplates();
}
