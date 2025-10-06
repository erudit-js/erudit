import {
    type ParsedElement,
    type ElementSchemaAny,
    type GenericStorage,
    fillStorage,
} from '@erudit-js/prose';

import globalElements from '#erudit/prose/global';
import { tryCreateLinkStorage } from '../default/link';

export async function resolveProse<TSchema extends ElementSchemaAny>(
    element: ParsedElement<TSchema>,
) {
    const storageGenerators = Object.fromEntries(
        Object.entries(globalElements).map(
            ([elementName, globalElementDefinition]) => [
                elementName,
                globalElementDefinition.createStorageData,
            ],
        ),
    );

    const storage: GenericStorage = {};

    await fillStorage({
        storage,
        storageGenerators,
        element,
        step: async (element) => {
            await tryCreateLinkStorage(element, storage);
        },
    });

    return { element, storage };
}
