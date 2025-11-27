export type EruditSeo = Partial<{
    title: string;
    indexTitle: string;
    indexDescription: string;
    defaultOgImage: string | { src: string; width: number; height: number };
}>;
