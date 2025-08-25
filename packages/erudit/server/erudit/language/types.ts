import { EruditLanguageCode } from '@erudit-js/cog/schema';

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
