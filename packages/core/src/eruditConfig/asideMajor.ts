export interface EruditAsideMajor {
  /** Info block at the top of aside. */
  siteInfo?: Partial<{
    title: string;
    short: string | false;
    logotype: string | false;
  }>;
  /** Any links that are displayed at the bottom of "Pages" pane. */
  customLinks?: EruditCustomLinks;
}

export interface EruditCustomLink {
  label: string;
  href: string;
  icon?: string;
}

export type EruditCustomLinks = EruditCustomLink[] | undefined;
