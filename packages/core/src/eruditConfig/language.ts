export const eruditLanguageCodes = ['en', 'ru'] as const;

export type EruditLanguageCode = (typeof eruditLanguageCodes)[number];

export type EruditTranslation = {
  name: string;
  link: string;
};

export type EruditTranslations = Record<EruditLanguageCode, EruditTranslation>;

export interface EruditLanguage {
  current: EruditLanguageCode;
  translations?: EruditTranslations;
  contribute?: string;
}
