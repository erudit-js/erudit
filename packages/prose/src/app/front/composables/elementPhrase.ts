import { inject } from 'vue';

import type { ParsedElement } from 'src/element';
import type { ElementSchemaAny } from 'src/schema';
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
