import type { AnySchema, ProseElement } from '@jsprose/core';
import { useAppElement } from './appElement.js';

export async function useElementIcon(schemaName: string): Promise<string>;
export async function useElementIcon(
    element: ProseElement<AnySchema>,
): Promise<string>;
export async function useElementIcon(
    elementOrName: string | ProseElement<AnySchema>,
): Promise<string> {
    const appElement = useAppElement(
        typeof elementOrName === 'string'
            ? elementOrName
            : elementOrName.schemaName,
    );
    return appElement.icon();
}
