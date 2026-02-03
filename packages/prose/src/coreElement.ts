import type { AnyRegistryItem } from '@jsprose/core';

export interface EruditProseCoreElement {
  registryItem: AnyRegistryItem;
  dependencies?: Record<
    string,
    {
      transpile?: boolean;
      optimize?: boolean;
    }
  >;
}

export function defineEruditProseCoreElement<
  TElement extends EruditProseCoreElement,
>(coreElement: TElement): TElement {
  return coreElement;
}

export function defineEruditProseCoreElements<
  TElements extends readonly EruditProseCoreElement[],
>(...coreElements: [...TElements]): TElements {
  return coreElements;
}
