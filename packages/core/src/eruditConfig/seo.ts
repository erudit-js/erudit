export type EruditSeoOgImageManual = {
  type: 'manual';
  src: string;
  width: number;
  height: number;
};

export type EruditSeoOgImageAuto = {
  type: 'auto';
  /** Path to the logotype image. Can be relative to project root or absolute. */
  logotype: string;
  /** Hex color for the OG image accent (e.g. `'#4aa44c'`). */
  siteColor: string;
  /** Site name displayed on the OG image. */
  siteName: string;
  /** Short site description displayed on the OG image. */
  siteShort: string;
  /**
   * Button label(s) on the OG image.
   *
   * - A single string — used for all buttons.
   * - `{ learn, open }` — `learn` for content pages, `open` for site pages.
   */
  phrases: string | { learn: string; open: string };
};

export type EruditSeo = Partial<{
  siteTitle: string;
  /** When possible, use book title instead of site title in SEO. */
  useBookSiteTitle?: boolean;
  /**
   * OG image configuration.
   *
   * - `undefined` — no OG images.
   * - `{ type: 'manual', src, width, height }` — use a custom provided image for all pages.
   * - `{ type: 'auto', logotype, siteColor, siteName, siteShort, phrases }` — autogenerate OG images with the specified parameters.
   */
  ogImage: EruditSeoOgImageManual | EruditSeoOgImageAuto;
}>;
