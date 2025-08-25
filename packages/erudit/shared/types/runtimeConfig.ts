import type {
    EruditCustomLinks,
    EruditDependencies,
    EruditLanguage,
    EruditRepository,
    EruditSiteBrandLayout,
    EruditSponsors,
} from '@erudit-js/cog/schema';

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
        dependencies: EruditDependencies;
    };
}

export interface EruditPublicRuntimeConfig {
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
            fakeApi: {
                repository: boolean;
            };
        };
        repository?: EruditRepository & { _link: string };
        style?: {
            brandColor?: string;
        };
        customLinks?: EruditCustomLinks;
        sponsors?: EruditSponsors;
    };
}
