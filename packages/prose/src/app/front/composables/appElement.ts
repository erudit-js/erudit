import { inject } from 'vue';

import { proseContextSymbol } from './appContext';
import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';

export async function useAppElement(element: ParsedElement<ElementSchemaAny>) {
    const { appElements } = inject(proseContextSymbol)!;
    const appElementDefinition = appElements[element.name];

    if (!appElementDefinition) {
        throw new Error(
            `No app element definition found for "${element.name}"!`,
        );
    }

    return appElementDefinition;
}
