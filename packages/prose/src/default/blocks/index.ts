import { isInlinerElement, type JsxElement } from '../../element';
import { ProseError } from '../../error';
import type { BlockSchemaAny, ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const blocksName = 'blocks';

export type BlocksSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof blocksName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: BlockSchemaAny[];
}>;

export const Blocks = defineTag(blocksName)<BlocksSchema>({
    type: ElementType.Block,
    name: blocksName,
    linkable: false,
    initElement({ tagName, element, children }) {
        if (!children) {
            throw new ProseError(
                `<${tagName}> requires at least one child element!`,
            );
        }

        element.children = children as JsxElement<BlockSchemaAny>[];
    },
    childStep({ tagName, child }) {
        if (isInlinerElement(child)) {
            throw new ProseError(
                `<${tagName}> can only have block children, but detected inliner child <${child.tagName}>!`,
            );
        }
    },
});
