import type { JsxElement } from '../element';
import type { ElementSchema } from '../schema';
import { ElementType } from '../type';

export const textName = 'text';

export type TextSchema = ElementSchema<
    ElementType.Inliner,
    typeof textName,
    string,
    undefined,
    undefined
>;

export function isTextElement(element: any): element is JsxElement<TextSchema> {
    return element && element.name === textName && element.tagName === textName;
}
