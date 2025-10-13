import {
    ensureBlockChild,
    ensureHasChildren,
    type RawChildren,
} from '../../children';
import type { JsxElement } from '../../element';
import { ProseError } from '../../error';
import type { BlockSchemaAny, ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const detailsName = 'details';

export type DetailsSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof detailsName;
    Linkable: true;
    Data: string | undefined;
    Storage: undefined;
    Children: BlockSchemaAny[];
}>;

export const Details = defineTag('details')<
    DetailsSchema,
    {
        title?: string;
        children: RawChildren;
    }
>({
    type: ElementType.Block,
    name: detailsName,
    linkable: true,
    initElement({ tagName, children, element, props }) {
        if (!element.uniqueSlug) {
            throw new ProseError(`<${tagName}> must be connected to unique!`);
        }

        ensureHasChildren(tagName, children);

        const title = props.title?.trim();
        if (title) {
            element.data = title;
            element.title = title;
        }

        element.children = children as JsxElement<BlockSchemaAny>[];
    },
    childStep({ tagName, child }) {
        ensureBlockChild(tagName, child);
    },
});
