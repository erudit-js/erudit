import type { ProseElementAny } from '../element';
import type { ProseTag } from '../tag';

export function defineGlobalElement<
    TElements extends ProseElementAny[],
    TElement extends TElements[number] = TElements[number],
>(definition: {
    tags: Record<string, ProseTag>;
    storage?: Partial<
        Record<
            TElement['name'],
            {
                createStorageKey?: (
                    element: TElement,
                ) => Promise<string> | string;
                createStorageData?: (
                    element: TElement,
                ) => Promise<TElement['storageData']> | TElement['storageData'];
            }
        >
    >;
    dependencies?: Record<string, { optimize?: boolean; transpile?: boolean }>;
}) {
    return definition;
}
