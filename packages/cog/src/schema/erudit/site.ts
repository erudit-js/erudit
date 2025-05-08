export type EruditSite = Partial<{
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
}>;
