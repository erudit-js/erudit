import type { ParsedElement } from './element';
import type { ElementSchemaAny } from './schema';

export type GenericStorage = Record<string, unknown>;

export async function fillStorage(argsObj: {
    storage: GenericStorage;
    element: ParsedElement<ElementSchemaAny>;
    storageGenerators: Record<
        string,
        | undefined
        | ((
              element: ParsedElement<ElementSchemaAny>,
          ) => Promise<unknown> | unknown)
    >;
    step?: (element: ParsedElement<ElementSchemaAny>) => Promise<void> | void;
}): Promise<void> {
    const storage: GenericStorage = argsObj.storage;

    async function createStorageForElement(
        element: ParsedElement<ElementSchemaAny>,
    ): Promise<void> {
        const storageKey = element.storageKey;

        if (storageKey && !storage[storageKey]) {
            const generator = argsObj.storageGenerators[element.name];
            if (generator) {
                storage[storageKey] = await generator(element);
            }
        }

        if (element.children?.length) {
            await Promise.all(
                element.children.map((child) =>
                    createStorageForElement(child).then(() =>
                        argsObj.step ? argsObj.step(child) : undefined,
                    ),
                ),
            );
        }
    }

    await createStorageForElement(argsObj.element);

    if (argsObj.step) {
        await argsObj.step(argsObj.element);
    }
}
