import type {
    ParsedElement,
    ElementSchemaAny,
    GenericStorage,
} from '@erudit-js/prose';
import type { LinkStorage } from '@erudit-js/prose/default/link/index';

export async function tryCreateLinkStorage(
    element: ParsedElement<ElementSchemaAny>,
    storage: GenericStorage,
): Promise<void> {
    return;
}
