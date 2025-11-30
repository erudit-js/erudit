import type { EruditLanguageCode } from '@erudit-js/core/eruditConfig/language';

export interface EruditServerLanguage {
    phrases: Record<string, LanguagePhraseValue>;
    functions: Record<string, Function>;
}

export interface ServerLanguageModule {
    default: LanguagePhrases;
    [key: string]: any;
}

export type ServerLanguageModules = Record<
    EruditLanguageCode,
    () => Promise<ServerLanguageModule>
>;
