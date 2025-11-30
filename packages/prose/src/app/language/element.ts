export interface ElementDefaultPhrases {
    element_name: string;
}

export type ElementPhrases<T extends Record<string, string> = {}> = Omit<
    T,
    keyof ElementDefaultPhrases
> &
    ElementDefaultPhrases;

export function defineElementLanguage<
    T extends ElementPhrases<T> = ElementPhrases,
>(phrases: T) {
    return phrases;
}

export type ElementLanguagesRaw<T extends ElementPhrases> = Record<
    string,
    () => Promise<{ default: T }>
>;

export type ElementLanguages<T extends ElementPhrases> = Record<
    string,
    () => Promise<T>
>;

export function resolveElementLanguages<T extends ElementPhrases<T>>(
    rawLanguages: ElementLanguagesRaw<T>,
): ElementLanguages<T> {
    return Object.fromEntries(
        Object.entries(rawLanguages).map(([languageCode, loadPhrases]) => [
            languageCode,
            async () => {
                const phrasesModule = await loadPhrases();
                return phrasesModule.default;
            },
        ]),
    ) as ElementLanguages<T>;
}
