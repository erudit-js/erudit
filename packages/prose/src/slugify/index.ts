export async function slugify(
    text: string,
    language: string,
): Promise<string | undefined> {
    const slugifiers: Record<
        string,
        () => Promise<{ default: (text: string) => string }>
    > = {
        en: async () => await import('./languages/en'),
        ru: async () => await import('./languages/ru'),
    };

    const slugifyModule =
        language in slugifiers ? await slugifiers[language]() : undefined;

    if (slugifyModule) {
        const slug = slugifyModule
            .default(text)
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        return slug || undefined;
    }

    return undefined;
}
