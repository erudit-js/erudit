import { inject } from 'vue';

import { proseContextSymbol } from './appContext';
import { proseLanguages } from '../languages/language';

export async function useProseLanguage() {
    const { languageCode } = inject(proseContextSymbol)!;
    return (await proseLanguages[languageCode]()).default;
}
