import type { EruditLanguageCode } from '@erudit-js/core/eruditConfig/language';

export interface EruditServerLanguage {
  phrases: LanguagePhrases;
  functions: Record<string, Function>;
}

export interface ServerLanguageModule {
  phrases: LanguagePhrases;
  [key: string]: Function | LanguagePhrases;
}

export type ServerLanguageModules = Record<
  EruditLanguageCode,
  () => Promise<ServerLanguageModule>
>;
