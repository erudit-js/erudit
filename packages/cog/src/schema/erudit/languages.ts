export const eruditLanguages = ['en', 'ru'] as const;

export type EruditLanguage = (typeof eruditLanguages)[number];
