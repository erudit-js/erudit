import { inject, type InjectionKey } from 'vue';
import type {
  ProseElement,
  ProseStorage,
  Schema,
  ToProseElement,
} from 'tsprose';

import { useAppElement } from './appElement.js';

export const proseStorageSymbol = Symbol() as InjectionKey<ProseStorage>;

export function useProseStorage() {
  return inject(proseStorageSymbol)!;
}

export async function useElementStorage<TElement extends ProseElement>(
  element: TElement,
): Promise<TElement['schema']['Storage']> {
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
}
