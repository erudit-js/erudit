import { useAppElement } from './appElement';
import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';

export async function useElementIcon(element: ParsedElement<ElementSchemaAny>) {
    const appElement = await useAppElement(element);
    return appElement.icon();
}
