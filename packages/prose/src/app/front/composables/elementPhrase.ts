import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';
import { useAppElement } from './appElement';
import { useProseAppContext } from './appContext';
import type { ElementPhrases } from '../../language';

export async function useElementPhrase<TPhrases extends ElementPhrases>(
    element: ParsedElement<ElementSchemaAny>,
) {
    const { languageCode } = useProseAppContext();
    const appElement = useAppElement(element);
    const languages = appElement.languages;
    return (await languages[languageCode]()) as TPhrases;
}
