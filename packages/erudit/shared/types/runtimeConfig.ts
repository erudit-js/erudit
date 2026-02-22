import type { EruditAdsBanners } from '@erudit-js/core/eruditConfig/ads';
import type { EruditLanguage } from '@erudit-js/core/eruditConfig/language';
import type { EruditRepository } from '@erudit-js/core/eruditConfig/repository';
import type { EruditSponsors } from '@erudit-js/core/sponsor';
import type { EruditContributors } from '@erudit-js/core/contributor';
import type { EruditIndexPage } from '@erudit-js/core/eruditConfig/indexPage';
import type { EruditSeo } from '@erudit-js/core/eruditConfig/seo';
import type { EruditAnalytics } from '@erudit-js/core/eruditConfig/analytics';
import type { EruditAsideMajor } from '@erudit-js/core/eruditConfig/asideMajor';
import type { EruditFaviconsResolved } from '@erudit-js/core/eruditConfig/favicons';

export interface EruditRuntimeConfig {
  elements: string[];
  countElements: (string | string[])[];
  indexPage?: EruditIndexPage;
}

export interface EruditPublicRuntimeConfig {
  language: EruditLanguage;
  asideMajor?: EruditAsideMajor;
  favicon?: EruditFaviconsResolved;
  loadingSvg?: string;
  seo?: EruditSeo;
  debug: {
    log: boolean;
    slowTransition: boolean;
    ads: boolean;
    fakeApi: {
      repository: boolean;
      lastChanged: boolean | string;
    };
    analytics?: boolean;
  };
  repository?: EruditRepository & { _link: string };
  style?: {
    brandColor?: string;
  };
  contributors?: EruditContributors;
  sponsors?: EruditSponsors;
  ads?: EruditAdsBanners;
  analytics?: EruditAnalytics;
}
