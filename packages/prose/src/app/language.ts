export type ElementDefaultPhrases = {
    element_name: string;
};

export type ElementPhrases<T extends Record<string, string> = {}> = Omit<
    T,
    keyof ElementDefaultPhrases
> &
    ElementDefaultPhrases;

export function defineElementLanguage<
    T extends ElementPhrases<T> = ElementPhrases<{}>,
>(phrases: T) {
    return phrases;
}

export type ElementLanguages<T extends ElementPhrases> = Record<
    string,
    () => Promise<T>
>;

export type ElementLanguagesRaw<T extends ElementPhrases> = Record<
    string,
    () => Promise<{ default: T }>
>;

export function resolveElementLanguages<T extends ElementPhrases<T>>(
    languageModules: ElementLanguagesRaw<T>,
): ElementLanguages<T> {
    return Object.fromEntries(
        Object.entries(languageModules).map(
            ([languageCode, languageModule]) => [
                languageCode,
                async () => (await languageModule()).default,
            ],
        ),
    );
}
