import type { JsxElement } from '../../element';
import type { ElementSchema } from '../../schema';
import { ElementType } from '../../type';

export const textName = 'text';

export type TextSchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof textName;
    Linkable: false;
    Data: string;
    Storage: undefined;
    Children: undefined;
}>;

export function isTextElement(element: any): element is JsxElement<TextSchema> {
    return element && element.name === textName && element.tagName === textName;
}
