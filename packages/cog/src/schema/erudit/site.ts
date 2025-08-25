export type EruditSiteBrandLayout = 'row' | 'column';

export type EruditSite = Partial<{
    buildUrl: string;
    baseUrl: string;
    title: string;
    slogan: string;
    brandLayout: EruditSiteBrandLayout;
    /**
     * - `string` — url to your logotype (use `projectPublic` to target path inside `public` directory)
     * - `false` — do not show logotype
     * - `falsy` — use default Erudit logotype
     */
    logotype: string | boolean;
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
