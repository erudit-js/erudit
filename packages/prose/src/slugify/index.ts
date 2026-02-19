import type { EruditRawToProseContext } from '../rawToProse/index.js';

export type SlugifyCreator = (
  context: EruditRawToProseContext,
) => Promise<(text: string) => string>;

export const createDefaultSlugify: SlugifyCreator = async (context) => {
  const slugifiers: Record<
    string,
    () => Promise<{ default: (text: string) => string }>
  > = {
    en: async () => await import('./languages/en.js'),
    ru: async () => await import('./languages/ru.js'),
  };

  const slugifyModule =
    context.language && context.language in slugifiers
      ? await slugifiers[context.language]()
      : undefined;

  if (slugifyModule) {
    return slugifyModule.default;
  }

  return (text: string) => text;
};
