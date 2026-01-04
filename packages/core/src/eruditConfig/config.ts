import type { Nuxt } from '@nuxt/schema';

import type { EruditIndexPage } from './indexPage.js';
import type { EruditSponsors } from '../sponsor.js';
import type { EruditAdsBanners } from './ads.js';
import type { EruditAnalytics } from './analytics.js';
import type { EruditContent } from './content.js';
import type { EruditDebug } from './debug.js';
import type { EruditCustomLinks } from './links.js';
import type { EruditRepository } from './repository.js';
import type { EruditSeo } from './seo.js';
import type { EruditSite } from './site.js';
import type { EruditLanguage } from './language.js';
import type { EruditElements } from './elements.js';

export interface EruditConfig {
    language?: EruditLanguage;
    debug?: EruditDebug;
    contentTargets?: string[];
    analytics?: EruditAnalytics;
    ads?: EruditAdsBanners;
    site?: EruditSite;
    index?: EruditIndexPage;
    content?: EruditContent;
    sponsors?: EruditSponsors;
    seo?: EruditSeo;
    repository?: EruditRepository;
    customLinks?: EruditCustomLinks;
    elements?: EruditElements;
    countElements?: (string | string[])[];
    /**
     * Erudit uses Nuxt under the hood.
     * Use this to alter Nuxt configuration.
     */
    nuxtAugmentations?: [(nuxt: Nuxt) => Promise<void> | void];
}
