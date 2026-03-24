import type { Nuxt } from 'nuxt/schema';
import type { NitroConfig } from 'nitropack';

import type { EruditIndexPage } from './indexPage.js';
import type { EruditSponsors } from '../sponsor.js';
import type { EruditAdsBanners } from './ads.js';
import type { EruditAnalytics } from './analytics.js';
import type { EruditDebug } from './debug.js';
import type { EruditRepository } from './repository.js';
import type { EruditSeo } from './seo.js';
import type { EruditLanguage } from './language.js';
import type { EruditContributors } from '../contributor.js';
import type { EruditAsideMajor } from './asideMajor.js';
import type { EruditFavicons } from './favicons.js';
import type { EruditDependencies } from '../dependencies.js';
import type { EruditLastmod } from './lastmod.js';

export interface EruditConfig {
  language?: EruditLanguage;
  debug?: EruditDebug;
  analytics?: EruditAnalytics;
  ads?: EruditAdsBanners;
  /** Settings for site major (left) aside. */
  asideMajor?: EruditAsideMajor;
  favicon?: EruditFavicons;
  style?: Partial<{
    brandColor: string;
  }>;
  loadingSvg?: string;
  indexPage?: EruditIndexPage;
  contributors?: EruditContributors;
  sponsors?: EruditSponsors;
  seo?: EruditSeo;
  repository?: EruditRepository;
  lastmod?: EruditLastmod;
  elements?: string[];
  countElements?: (string | string[])[];
  problemChecks?: string[];
  /**
   * Files whose named exports become globally available
   * in all content files (no imports needed).
   *
   * Paths are resolved relative to the project root,
   * just like `elements` and `problemChecks`.
   *
   * @example ['./my-globals']
   */
  autoImports?: string[];
  dependencies?: EruditDependencies;
  /**
   * Erudit uses Nuxt under the hood.
   * Use this to alter Nuxt configuration.
   */
  nuxtAugmentations?: (({
    nuxt,
    nitro,
    projectPath,
    eruditPath,
  }: {
    nuxt: Nuxt;
    nitro: NitroConfig;
    projectPath: string;
    eruditPath: string;
  }) => Promise<void> | void)[];
}
