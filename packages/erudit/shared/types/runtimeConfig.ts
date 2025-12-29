import type { EruditMode } from '@erudit-js/core/mode';
import type { EruditAdsBanners } from '@erudit-js/core/eruditConfig/ads';
import type { EruditLanguage } from '@erudit-js/core/eruditConfig/language';
import type { EruditCustomLinks } from '@erudit-js/core/eruditConfig/links';
import type { EruditRepository } from '@erudit-js/core/eruditConfig/repository';
import type { EruditSiteBrandLayout } from '@erudit-js/core/eruditConfig/site';
import type { EruditSponsors } from '@erudit-js/core/sponsor';

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
            slogan?: string;
            logotype?: string | boolean;
            brandLayout: EruditSiteBrandLayout;
        };
        debug: {
            log: boolean;
            slowTransition: boolean;
            ads: boolean;
            fakeApi: {
                repository: boolean;
            };
        };
        countElements: (string | string[])[];
        repository?: EruditRepository & { _link: string };
        style?: {
            brandColor?: string;
        };
        customLinks?: EruditCustomLinks;
        sponsors?: EruditSponsors;
        ads?: EruditAdsBanners;
    };
}
