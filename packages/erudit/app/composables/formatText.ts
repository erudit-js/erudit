import eruditConfig from '#erudit/config';

let formatFunction: FormatFunction;

export function useFormatText() {
    if (!formatFunction) {
        const language = eruditConfig?.language;
        formatFunction = createFormatFunction(language);
    }

    return formatFunction;
}

type FormatFunction = (text: string) => string;

function createFormatFunction(language?: string): FormatFunction {
    const formatters: FormatFunction[] = [];

    //
    // Em Dashes
    //

    formatters.push((text) => text.replace(/(^| )--($| )/gm, '$1—$2'));

    //
    // Quotes
    //

    {
        const quoteSymbols: [string, string] = (() => {
            switch (language) {
                case 'ru':
                    return ['«', '»'];
                default:
                    return ['“', '”'];
            }
        })();

        formatters.push((text) => {
            let open = false;
            return text.replaceAll(/"/gm, () => {
                return (open = !open) ? quoteSymbols[0] : quoteSymbols[1];
            });
        });
    }

    //
    // Ellipsis
    //

    formatters.push((text) => text.replace(/\.\.\./gm, '…'));

    //
    // Language specific formatters
    //

    if (language === 'ru') formatters.push(ruStickyPrepositions);

    //
    //
    //

    function formatText(text: string): string {
        if (!text) return text;

        for (const formatter of formatters) text = formatter(text);

        return text;
    }

    return formatText;
}

//
//
//

/**
 * Formats prepositions in Russian text so that they are always adjacent to the next word and are not left hanging “in the air” when the line breaks.
 */
function ruStickyPrepositions(text: string): string {
    return text.replace(
        / (в|не|без|для|до|за|из|к|на|над|о|об|от|по|под|при|про|с|у|через|вокруг|около|после|перед|между|внутри|вне|из-за|из-под|ради|сквозь|среди|насчёт|вследствие|благодаря|несмотря|наперекор|вопреки|подле|возле|рядом|навстречу) /gimu,
        ' $1\xa0',
    );
}
