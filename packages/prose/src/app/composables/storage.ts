import { inject, type InjectionKey } from 'vue';
import {
    ProseError,
    type AnySchema,
    type GenericStorage,
    type ProseElement,
} from '@jsprose/core';

import { useAppElement } from './appElement.js';

export const proseStorageSymbol = Symbol() as InjectionKey<GenericStorage>;

export function useProseStorage() {
    return inject(proseStorageSymbol)!;
}

export async function useElementStorage<TSchema extends AnySchema>(
    element: ProseElement<TSchema>,
): Promise<TSchema['Storage']> {
    const storage = useProseStorage();
    const appElement = useAppElement(element);

    if (!element.storageKey) {
        return undefined;
    }

    if (appElement.createStorage) {
        storage[element.storageKey] = await appElement.createStorage(element);
    }

    if (element.storageKey in storage) {
        return storage[element.storageKey];
    }

    // throw new ProseError(
    //     `Element ${element.schemaName} with storage key "${element.storageKey}" has no storage value!`,
    // );
}
