export type EruditIndexPage = Partial<{
  title: string;
  short: string;
  description: string;
  topImage: {
    src: string;
    maxWidth?: string;
    invert?: 'light' | 'dark';
  };
  seo?: {
    title?: string;
    description?: string;
  };
}>;
