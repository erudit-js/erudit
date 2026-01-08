export type EruditSite = Partial<{
    buildUrl: string;
    baseUrl: string;
    title: string;
    short: string | false;
    /**
     * - `string` — url to your logotype (use `projectPublic` to target path inside `public` directory)
     * - `false` — do not show logotype
     * - falsy (`0`, `undefined`, `null`, `""` and etc.) — use default Erudit logotype
     */
    logotype: string | false;
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
