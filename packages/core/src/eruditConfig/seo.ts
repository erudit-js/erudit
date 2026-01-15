export type EruditSeo = Partial<{
    siteTitle: string;
    /** When possible, use book title instead of site title in SEO. */
    useBookSiteTitle?: boolean;
    image: { src: string; width: number; height: number };
}>;
