import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';
import { useAppElement } from './appElement';
import { useProseAppContext } from './appContext';

export async function useElementPhrase(
    element: ParsedElement<ElementSchemaAny>,
) {
    const { languageCode } = useProseAppContext();
    const appElement = useAppElement(element);
    const languages = appElement.languages;
    return await languages[languageCode]();
}
