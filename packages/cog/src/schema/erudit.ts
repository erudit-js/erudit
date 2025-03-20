export interface EruditConfigDebug {
    log: boolean;
    slowTransition: boolean;
    fakeApi: Partial<{
        repository: boolean;
        languages: boolean;
    }>;
}

export interface EruditConfigSite {
    buildUrl: string;
    baseUrl: string;
    title: string;
    slogan: string;
    logotype: string;
    favicon: Partial<{
        default: string;
        article: string;
        summary: string;
        practice: string;
    }>;
    style: Partial<{
        brandColor: string;
    }>;
}

export interface EruditConfigSeo {
    title: string;
    indexTitle: string;
    indexDescription: string;
    defaultOgImage: string | { src: string; width: number; height: number };
}

export interface EruditConfigRepository {
    name: string;
    branch: string;
    sharedUrl: string;
}

export interface EruditConfigAds {
    leftBlockId: string;
    bottomBlockId: string;
}

export type EruditConfigDependencyOptions = Partial<{
    transpile: boolean;
    optimize: boolean;
}>;

export type EruditConfigDependencies = Record<
    string,
    EruditConfigDependencyOptions
>;

//
//
//

export interface EruditConfig {
    language: string;
    contentTargets: string[];
    debug: Partial<EruditConfigDebug>;
    site: Partial<EruditConfigSite>;
    seo: Partial<EruditConfigSeo>;
    repository: Partial<EruditConfigRepository>;
    ads: Partial<EruditConfigAds>;
    dependencies: Partial<EruditConfigDependencies>;
}
