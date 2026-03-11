import type { FormatText, FormatTextState } from '@erudit-js/core/formatText';

type LanguageFormatText = (text: string) => string;

function enFormatter(text: string): string {
  return text.replaceAll("'", '\u2019');
}

function ruFormatter(text: string): string {
  return text.replace(
    / (в|не|без|для|до|за|из|к|на|над|о|об|от|по|под|при|про|с|у|через|вокруг|около|после|перед|между|внутри|вне|из-за|из-под|ради|сквозь|среди|насчёт|вследствие|благодаря|несмотря|наперекор|вопреки|подле|возле|рядом|навстречу) /gimu,
    ' $1\xa0',
  );
}

const builtInFormatters: Partial<Record<string, LanguageFormatText>> = {
  en: enFormatter,
  ru: ruFormatter,
};

export function createFormatTextFn(
  languageCode: string,
  extraFormatter?: LanguageFormatText,
): FormatText {
  const langFormatter =
    extraFormatter ?? builtInFormatters[languageCode] ?? ((t: string) => t);

  const quoteSymbols: [string, string] =
    languageCode === 'ru' ? ['\u00AB', '\u00BB'] : ['\u201C', '\u201D'];

  function formatText(text: string, state?: FormatTextState): string;
  function formatText(text: undefined, state?: FormatTextState): undefined;
  function formatText(
    text?: string,
    state?: FormatTextState,
  ): string | undefined;
  function formatText(
    text?: string,
    state?: FormatTextState,
  ): string | undefined {
    if (text === undefined) {
      return text;
    }

    // Normalize spacing
    text = text
      .trim()
      .replace(/\r\n/gm, '\n')
      .replace(/\n{3,}/gm, '\n\n')
      .replace(/[ \t]+/gm, ' ');

    // Normalize dashes
    text = text.replace(/(^| )--($| )/gm, '$1\u2014$2');

    // Normalize quotes
    let quoteOpen = state?.quote === 'opened';
    text = text.replaceAll(/"/gm, () => {
      quoteOpen = !quoteOpen;
      if (state) {
        state.quote = quoteOpen ? 'opened' : 'closed';
      }
      return quoteOpen ? quoteSymbols[0] : quoteSymbols[1];
    });

    // Normalize ellipsis
    text = text.replace(/\.{3}/gm, '\u2026');

    // Language-specific formatting
    return langFormatter(text);
  }

  return formatText;
}
