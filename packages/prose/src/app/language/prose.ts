type Phrases<TPhrases extends Record<string, string>> = TPhrases;

export type ProsePhrases = Phrases<{
    copy_link: string;
    copied: string;
}>;

export const proseLanguages: Record<
    string,
    () => Promise<{ default: ProsePhrases }>
> = {
    en: () => import('./list/en.js'),
    ru: () => import('./list/ru.js'),
};
