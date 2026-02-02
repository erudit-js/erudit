import type { EruditAdsBanners } from '@erudit-js/core/eruditConfig/ads';
import type { EruditLanguage } from '@erudit-js/core/eruditConfig/language';
import type { EruditCustomLinks } from '@erudit-js/core/eruditConfig/links';
import type { EruditRepository } from '@erudit-js/core/eruditConfig/repository';
import type { EruditSponsors } from '@erudit-js/core/sponsor';
import type { EruditContributors } from '@erudit-js/core/contributor';
import type { EruditIndexPage } from '@erudit-js/core/eruditConfig/indexPage';
import type { EruditSiteFaviconResolved } from '@erudit-js/core/eruditConfig/site';
import type { EruditSeo } from '@erudit-js/core/eruditConfig/seo';
import type { EruditAnalytics } from '@erudit-js/core/eruditConfig/analytics';

export interface EruditRuntimeConfig {
  elements: string[];
  countElements: (string | string[])[];
  indexPage?: EruditIndexPage;
}

export interface EruditPublicRuntimeConfig {
  language: EruditLanguage;
  siteInfo: {
    title?: string;
    short?: string | false;
    logotype?: string | false;
    favicon?: EruditSiteFaviconResolved;
    loadingSvg?: string;
  };
  seo?: EruditSeo;
  debug: {
    log: boolean;
    slowTransition: boolean;
    ads: boolean;
    fakeApi: {
      repository: boolean;
    };
    analytics?: boolean;
  };
  repository?: EruditRepository & { _link: string };
  style?: {
    brandColor?: string;
  };
  customLinks?: EruditCustomLinks;
  contributors?: EruditContributors;
  sponsors?: EruditSponsors;
  ads?: EruditAdsBanners;
  analytics?: EruditAnalytics;
}
