import type { ProseElementAny } from '../element';

export function defineServerElement<
    TElement extends ProseElementAny,
>(definition: {
    createStorageData?: (
        element: TElement,
    ) => Promise<TElement['storageData']> | TElement['storageData'];
}) {
    return definition;
}
