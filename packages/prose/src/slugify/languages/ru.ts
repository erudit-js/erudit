export default (text: string): string => {
  const cyrillicToLatin: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };

  return text
    .replace(/(\p{Lu}{2,})(\p{Ll})/gu, '$1-$2')
    .replace(/(\p{Ll})(\p{Lu})/gu, '$1-$2')
    .replace(/(\p{L})(\d)/gu, '$1-$2')
    .replace(/(\d)(\p{L})/gu, '$1-$2')
    .toLowerCase()
    .split('')
    .map((char) =>
      cyrillicToLatin[char] !== undefined
        ? cyrillicToLatin[char]
        : /[a-z0-9]/.test(char)
          ? char
          : '-',
    )
    .join('')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
