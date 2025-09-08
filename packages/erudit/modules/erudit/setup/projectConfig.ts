import type { Nuxt } from '@nuxt/schema';
import type { EruditConfig } from '@erudit-js/cog/schema';

import type {
    EruditRuntimeConfig,
    EruditPublicRuntimeConfig,
} from '../../../shared/types/runtimeConfig';
import { moduleLogger } from '../logger';

export async function addEruditProjectConfigToRuntime(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
    publicRuntimeConfig: EruditPublicRuntimeConfig,
) {
    let projectConfig: Partial<EruditConfig> = {};

    try {
        projectConfig = (
            await import(runtimeConfig.paths.project + '/erudit.config')
        ).default as Partial<EruditConfig>;

        if (typeof projectConfig !== 'object') {
            throw new Error(
                'Project config must export an object, got: ' +
                    typeof projectConfig,
            );
        }
    } catch (error) {
        moduleLogger.warn(`Failed to load Erudit project config!\n\n${error}`);
    }

    await transferConfigData(
        nuxt,
        projectConfig,
        runtimeConfig,
        publicRuntimeConfig,
    );

    if (projectConfig.nuxtAugmentations) {
        return projectConfig.nuxtAugmentations;
    }
}

async function transferConfigData(
    nuxt: Nuxt,
    projectConfig: Partial<EruditConfig>,
    runtimeConfig: EruditRuntimeConfig,
    publicRuntimeConfig: EruditPublicRuntimeConfig,
) {
    runtimeConfig.project = {
        elements: projectConfig.elements || [],
    };

    publicRuntimeConfig.project = {
        language: projectConfig.language || { current: 'en' },
        baseUrl: projectConfig.site?.baseUrl || '/',
        debug: {
            log: projectConfig.debug?.log ?? false,
            slowTransition: projectConfig.debug?.slowTransition ?? false,
            fakeApi: {
                repository:
                    projectConfig.debug?.fakeApi?.repository ??
                    nuxt.options.dev,
            },
        },
        siteInfo: {
            title: projectConfig.site?.title,
            slogan: projectConfig.site?.slogan,
            logotype: projectConfig.site?.logotype,
            brandLayout: projectConfig.site?.brandLayout || 'row',
        },
        style: {
            brandColor: projectConfig.site?.style?.brandColor,
        },
        repository: (() => {
            const repository = projectConfig.repository;

            if (!repository) {
                return undefined;
            }

            const link = (() => {
                switch (repository.type) {
                    case 'custom':
                        return repository.link;
                    case 'github':
                        return `https://github.com/${repository.name}/tree/${repository.branch}`;
                }
            })();

            return {
                ...repository,
                _link: link,
            };
        })(),
        customLinks: projectConfig.customLinks,
        sponsors: projectConfig.sponsors,
    };
}
