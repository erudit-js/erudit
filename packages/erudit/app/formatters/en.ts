export default (text: string) => {
  text = typographicApostrophes(text);
  return text;
};

/**
 * Replaces straight apostrophes (') with typographic (curly) apostrophes (’).
 * In English, the right single quotation mark U+2019 is the correct character
 * for apostrophes in contractions (don’t), possessives (John’s), and omissions (’90s).
 */
function typographicApostrophes(text: string): string {
  return text.replaceAll("'", '’');
}
