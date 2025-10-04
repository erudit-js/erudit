export type FormatText = (text: string) => string;

const formatTextLoaders: Partial<
    Record<LanguageCode, () => Promise<{ default: FormatText }>>
> = {
    ru: () => import('../formatters/ru'),
};

export async function useFormatText(): Promise<FormatText> {
    const languageCode = ERUDIT.config.project.language.current;

    const formatTextLoader =
        languageCode in formatTextLoaders
            ? formatTextLoaders[languageCode]
            : undefined;

    let languageFormatText: FormatText = (text) => text;
    if (formatTextLoader) {
        languageFormatText = (await formatTextLoader()).default;
    }

    function formatText(text: string): string {
        //
        // Normalize dashes
        //

        {
            text = text.replace(/(^| )--($| )/gm, '$1—$2');
        }

        //
        // Normalize quotes
        //

        {
            const quoteSymbols: [string, string] = (() => {
                switch (languageCode) {
                    case 'ru':
                        return ['«', '»'];
                    default:
                        return ['“', '”'];
                }
            })();

            let quoteOpen = false;
            text = text.replaceAll(/"/gm, () => {
                return (quoteOpen = !quoteOpen)
                    ? quoteSymbols[0]
                    : quoteSymbols[1];
            });
        }

        //
        // Normalize ellipsis
        //

        {
            text = text.replace(/\.{3}/gm, '…');
        }

        //
        // Language-specific formatting
        //

        return languageFormatText(text);
    }

    return formatText;
}
