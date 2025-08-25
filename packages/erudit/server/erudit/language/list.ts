import type { ServerLanguageModules } from './types';

export const serverLanguages: ServerLanguageModules = {
    en: () => import('./list/en'),
    ru: () => import('./list/ru'),
};
