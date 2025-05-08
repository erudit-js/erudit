import type { EruditAds } from './ads';
import type { EruditBitran } from './bitran';
import type { EruditDebug } from './debug';
import type { EruditDependencies } from './dependencies';
import type { EruditLanguage } from './languages';
import type { EruditRepository } from './repository';
import type { EruditSeo } from './seo';
import type { EruditSite } from './site';

export interface EruditConfig {
    language?: EruditLanguage;
    debug?: EruditDebug;
    conentTargets?: string[];
    ads?: EruditAds;
    site?: EruditSite;
    seo?: EruditSeo;
    repository?: EruditRepository;
    bitran?: EruditBitran;
    dependencies?: EruditDependencies;
}
