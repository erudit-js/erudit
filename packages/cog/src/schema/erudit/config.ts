import type { EruditSponsors } from '../sponsor';
import type { EruditAdsBanners } from './ads';
import type { EruditAnalytics } from './analytics';
import type { EruditBitran } from './bitran';
import type { EruditContent } from './content';
import type { EruditDebug } from './debug';
import type { EruditDependencies } from './dependencies';
import type { EruditLanguage } from './languages';
import type { EruditCustomLinks } from './links';
import type { EruditRepository } from './repository';
import type { EruditSeo } from './seo';
import type { EruditSite } from './site';

export interface EruditConfig {
    language?: EruditLanguage;
    debug?: EruditDebug;
    contentTargets?: string[];
    analytics?: EruditAnalytics;
    ads?: EruditAdsBanners;
    site?: EruditSite;
    content?: EruditContent;
    sponsors?: EruditSponsors;
    seo?: EruditSeo;
    repository?: EruditRepository;
    customLinks?: EruditCustomLinks;
    bitran?: EruditBitran;
    dependencies?: EruditDependencies;
}
