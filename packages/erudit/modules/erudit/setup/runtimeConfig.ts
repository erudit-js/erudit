import { existsSync } from 'node:fs';
import type { Nuxt } from '@nuxt/schema';
import type { EruditConfig } from '@erudit-js/core/eruditConfig/config';
import { sn } from 'unslash';

import { PROJECT_PATH } from '../env.js';
import { moduleLogger } from '../logger.js';
import type {
  EruditPublicRuntimeConfig,
  EruditRuntimeConfig,
} from '../../../shared/types/runtimeConfig';

export async function setupEruditRuntimeConfig(nuxt: Nuxt) {
  let eruditConfig: EruditConfig = {};
  try {
    eruditConfig = (await import(sn(PROJECT_PATH, 'erudit.config'))).default;
  } catch (error) {
    if (existsSync(sn(PROJECT_PATH, 'erudit.config.ts'))) {
      moduleLogger.warn(
        `Config file "erudit.config.ts" is present but failed to load!\n\n${error}`,
      );
    }
  }

  //
  // Erudit Runtime Config
  //

  nuxt.options.runtimeConfig.erudit = {
    elements: eruditConfig.elements || [],
    countElements: eruditConfig.countElements || [],
    indexPage: eruditConfig.indexPage,
  } satisfies EruditRuntimeConfig;

  //
  // Erudit Public Runtime Config
  //

  nuxt.options.runtimeConfig.public.erudit = {
    debug: {
      ads: eruditConfig.debug?.ads ?? false,
      log: eruditConfig.debug?.log ?? false,
      slowTransition: eruditConfig.debug?.slowTransition ?? false,
      fakeApi: {
        repository: eruditConfig.debug?.fakeApi?.repository ?? nuxt.options.dev,
      },
      analytics: eruditConfig.debug?.analytics,
    },
    language: eruditConfig.language || { current: 'en' },
    siteInfo: {
      title: eruditConfig.site?.title,
      short: eruditConfig.site?.short,
      logotype: eruditConfig.site?.logotype,
      favicon: eruditConfig.site?.favicon
        ? typeof eruditConfig.site?.favicon === 'string'
          ? { default: eruditConfig.site?.favicon }
          : eruditConfig.site?.favicon
        : undefined,
      loadingSvg: eruditConfig.site?.loadingSvg,
    },
    seo: eruditConfig.seo,
    style: {
      brandColor: eruditConfig.site?.style?.brandColor,
    },
    repository: (() => {
      const repository = eruditConfig.repository;

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
    customLinks: eruditConfig.customLinks,
    contributors: eruditConfig.contributors,
    sponsors: eruditConfig.sponsors,
    ads: eruditConfig.ads,
    analytics: eruditConfig.analytics,
  } satisfies EruditPublicRuntimeConfig;

  //
  // Other
  //

  nuxt.options.runtimeConfig.public.buildTime = Date.now();

  return {
    eruditRuntimeConfig: nuxt.options.runtimeConfig
      .erudit as EruditRuntimeConfig,
    eruditPublicRuntimeConfig: nuxt.options.runtimeConfig.public
      .erudit as EruditPublicRuntimeConfig,
    nuxtAugmentations: eruditConfig.nuxtAugmentations,
  };
}
