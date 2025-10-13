import { useProseAppContext } from './appContext';
import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';
import { ProseError } from '../../../error';

export function useAppElement(element: ParsedElement<ElementSchemaAny>) {
    const { appElements } = useProseAppContext();
    const appElementDefinition = appElements[element.name];

    if (!appElementDefinition) {
        throw new ProseError(
            `No app element definition found for "${element.name}"!`,
        );
    }

    return appElementDefinition;
}
