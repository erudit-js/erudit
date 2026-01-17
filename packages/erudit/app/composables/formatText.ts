import type { FormatTextState, FormatText } from '@erudit-js/core/formatText';

type LanguageFormatText = (text: string) => string;

const formatTextLoaders: Partial<
    Record<LanguageCode, () => Promise<{ default: LanguageFormatText }>>
> = {
    ru: () => import('../formatters/ru'),
};

export let formatText: FormatText;

export async function initFormatText() {
    const languageCode = ERUDIT.config.project.language.current;

    const formatTextLoader =
        languageCode in formatTextLoaders
            ? formatTextLoaders[languageCode]
            : undefined;

    let languageFormatText: LanguageFormatText = (text) => text;
    if (formatTextLoader) {
        languageFormatText = (await formatTextLoader()).default;
    }

    function _formatText(text: string, state?: FormatTextState): string;
    function _formatText(text: undefined, state?: FormatTextState): undefined;
    function _formatText(
        text?: string,
        state?: FormatTextState,
    ): string | undefined;
    function _formatText(
        text?: string,
        state?: FormatTextState,
    ): string | undefined {
        if (text === undefined) {
            return text;
        }

        //
        // Normalize spacing (new lines, spaces)
        //

        {
            text = text
                .trim()
                .replace(/\r\n/gm, '\n')
                .replace(/\n{3,}/gm, '\n\n')
                .replace(/[ \t]+/gm, ' ');
        }

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

            let quoteOpen = state?.quote === 'opened';
            text = text.replaceAll(/"/gm, () => {
                quoteOpen = !quoteOpen;
                if (state) {
                    state.quote = quoteOpen ? 'opened' : 'closed';
                }
                return quoteOpen ? quoteSymbols[0] : quoteSymbols[1];
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

    formatText = _formatText;
}
