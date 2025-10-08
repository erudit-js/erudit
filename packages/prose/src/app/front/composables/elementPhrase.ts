import { inject } from 'vue';

import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';
import { useAppElement } from './appElement';
import { proseContextSymbol } from './appContext';

export async function useElementPhrase(
    element: ParsedElement<ElementSchemaAny>,
) {
    const { languageCode } = inject(proseContextSymbol)!;
    const appElement = await useAppElement(element);
    const languages = appElement.languages;
    return await languages[languageCode]();
}
