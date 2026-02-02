export default (text: string) => {
  text = ruStickyPrepositions(text);
  return text;
};

/**
 * Formats prepositions in Russian text so that they are always adjacent to the next word and are not left hanging “in the air” when the line breaks.
 */
function ruStickyPrepositions(text: string): string {
  return text.replace(
    / (в|не|без|для|до|за|из|к|на|над|о|об|от|по|под|при|про|с|у|через|вокруг|около|после|перед|между|внутри|вне|из-за|из-под|ради|сквозь|среди|насчёт|вследствие|благодаря|несмотря|наперекор|вопреки|подле|возле|рядом|навстречу) /gimu,
    ' $1\xa0',
  );
}
