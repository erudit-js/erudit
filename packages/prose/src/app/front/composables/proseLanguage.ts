import { useProseAppContext } from './appContext';
import { proseLanguages } from '../languages/language';

export async function useProseLanguage() {
    const { languageCode } = useProseAppContext();
    return (await proseLanguages[languageCode]()).default;
}
