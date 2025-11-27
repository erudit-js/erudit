import type { ElementSchemaAny, ParsedElement } from '@erudit-js/prose';

import { tryAddFileSrc } from './fileSrc';
import { tryAddProblemGeneratorSrc } from './problemGeneratorSrc';

export type ParseDataType = 'fileSrc' | 'problemGeneratorSrc';

export async function contentParseDataStep(
    contentFullId: string,
    element: ParsedElement<ElementSchemaAny>,
) {
    await tryAddFileSrc(contentFullId, element);
    await tryAddProblemGeneratorSrc(contentFullId, element);
}
