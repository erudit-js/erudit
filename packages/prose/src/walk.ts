import type { JsxElement, ParsedElement } from './element';
import type { ElementSchemaAny } from './schema';

export enum ElementWalk {
    Stop = 'stop',
    NoDeeper = 'no-deeper',
}

export async function walkElements<
    TElementKind extends
        | JsxElement<ElementSchemaAny>
        | ParsedElement<ElementSchemaAny>,
>(
    element: TElementKind,
    step: (
        el: TElementKind,
    ) => ElementWalk | void | Promise<ElementWalk | void>,
): Promise<ElementWalk | void> {
    const result = await step(element);

    if (result === ElementWalk.Stop) {
        return ElementWalk.Stop;
    }

    if (result === ElementWalk.NoDeeper) {
        return;
    }

    const children = element.children;
    if (children) {
        for (const child of children.filter(Boolean)) {
            const childResult = await walkElements(child as TElementKind, step);
            if (childResult === ElementWalk.Stop) {
                return ElementWalk.Stop;
            }
        }
    }
}
