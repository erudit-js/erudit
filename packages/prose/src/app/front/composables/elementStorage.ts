import { useProseAppContext } from './appContext';
import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';
import { ProseError } from '../../../error';

export async function useElementStorage<TSchema extends ElementSchemaAny>(
    element: ParsedElement<TSchema>,
): Promise<TSchema['Storage']> {
    const { storage, appElements } = useProseAppContext();
    const appElement = appElements[element.name];

    if (element.storageKey) {
        if (element.storageKey in storage) {
            return storage[element.storageKey] as TSchema['Storage'];
        }

        if (appElement && appElement.createStorageData) {
            return (await appElement.createStorageData(
                element,
            )) as TSchema['Storage'];
        }

        throw new ProseError(
            `Element "${element.name}" storage key is present but storage data is missing and can not be created!`,
        );
    }
}
