export type EruditSeo = Partial<{
  siteTitle: string;
  /** When possible, use book title instead of site title in SEO. */
  useBookSiteTitle?: boolean;
  /**
   * OG image configuration.
   *
   * - `undefined` or `true` — automatically generate OG images for content pages (default).
   * - `false` — disable OG images entirely.
   * - `{ src, width, height }` — use a custom provided image for all pages.
   */
  ogImage: { src: string; width: number; height: number } | boolean;
}>;
