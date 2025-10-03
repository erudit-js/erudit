import type { Nuxt } from '@nuxt/schema';

import type { EruditIndex } from './index';
import type { EruditSponsors } from '../sponsor';
import type { EruditAdsBanners } from './ads';
import type { EruditAnalytics } from './analytics';
import type { EruditContent } from './content';
import type { EruditDebug } from './debug';
import type { EruditCustomLinks } from './links';
import type { EruditRepository } from './repository';
import type { EruditSeo } from './seo';
import type { EruditSite } from './site';
import type { EruditLanguage } from './language';
import type { EruditElements } from './elements';

export interface EruditConfig {
    language?: EruditLanguage;
    debug?: EruditDebug;
    contentTargets?: string[];
    analytics?: EruditAnalytics;
    ads?: EruditAdsBanners;
    site?: EruditSite;
    index?: EruditIndex;
    content?: EruditContent;
    sponsors?: EruditSponsors;
    seo?: EruditSeo;
    repository?: EruditRepository;
    customLinks?: EruditCustomLinks;
    elements?: EruditElements;
    /**
     * Erudit uses Nuxt under the hood.
     * Use this to alter Nuxt configuration.
     */
    nuxtAugmentations?: [(nuxt: Nuxt) => Promise<void> | void];
}
