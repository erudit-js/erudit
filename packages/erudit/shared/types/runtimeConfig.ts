import type { EruditMode } from '@erudit-js/core/mode';
import type { EruditAdsBanners } from '@erudit-js/core/eruditConfig/ads';
import type { EruditLanguage } from '@erudit-js/core/eruditConfig/language';
import type { EruditCustomLinks } from '@erudit-js/core/eruditConfig/links';
import type { EruditRepository } from '@erudit-js/core/eruditConfig/repository';
import type { EruditSponsors } from '@erudit-js/core/sponsor';
import type { EruditContributors } from '@erudit-js/core/contributor';
import type { EruditIndexPage } from '@erudit-js/core/eruditConfig/indexPage';

export interface EruditRuntimeConfigPaths {
    package: string;
    module: string;
    app: string;
    server: string;
    project: string;
    build: string;
}

export interface EruditRuntimeConfig {
    paths: EruditRuntimeConfigPaths;
    project: {
        elements: string[];
        countElements: (string | string[])[];
        indexPage?: EruditIndexPage;
    };
}

export interface EruditPublicRuntimeConfig {
    mode: EruditMode;
    version: string;
    project: {
        language: EruditLanguage;
        baseUrl: string;
        siteInfo: {
            title?: string;
            short?: string | false;
            logotype?: string | false;
        };
        debug: {
            log: boolean;
            slowTransition: boolean;
            ads: boolean;
            fakeApi: {
                repository: boolean;
            };
        };
        repository?: EruditRepository & { _link: string };
        style?: {
            brandColor?: string;
        };
        customLinks?: EruditCustomLinks;
        contributors?: EruditContributors;
        sponsors?: EruditSponsors;
        ads?: EruditAdsBanners;
    };
}
