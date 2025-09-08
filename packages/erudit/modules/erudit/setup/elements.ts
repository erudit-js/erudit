import type { Nuxt } from '@nuxt/schema';

import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';
import { moduleLogger } from '../logger';

export async function setupEruditElements(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    const elementPaths = runtimeConfig.project.elements;
    moduleLogger.info('Setting up Erudit elements...');
    console.log(elementPaths);
}
