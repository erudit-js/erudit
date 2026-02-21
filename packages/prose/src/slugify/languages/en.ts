export default (text: string): string => {
  return text
    .replace(/(\p{Lu}{2,})(\p{Ll})/gu, '$1-$2')
    .replace(/(\p{Ll})(\p{Lu})/gu, '$1-$2')
    .replace(/(\p{L})(\d)/gu, '$1-$2')
    .replace(/(\d)(\p{L})/gu, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
