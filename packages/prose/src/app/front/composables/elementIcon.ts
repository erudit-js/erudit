import { inject } from 'vue';

import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';
import { proseContextSymbol } from './appContext';

export async function useElementIcon(element: ParsedElement<ElementSchemaAny>) {
    const { appElements } = inject(proseContextSymbol)!;
    const appElementDefinition = appElements[element.name];

    if (!appElementDefinition) {
        throw new Error(
            `No app element definition found for "${element.name}"!`,
        );
    }

    return appElementDefinition.icon();
}
