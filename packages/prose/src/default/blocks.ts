import type { RawChildren } from '../children';
import { isInlinerElement, type JsxElement } from '../element';
import { ProseError } from '../error';
import { PropsMode } from '../props';
import type { BlockSchemaAny, ElementSchema } from '../schema';
import { defineTag } from '../tag';
import { ElementType } from '../type';

export const blocksName = 'blocks';

export type BlocksSchema = ElementSchema<
    ElementType.Block,
    typeof blocksName,
    undefined,
    undefined,
    BlockSchemaAny[]
>;

export const Blocks = defineTag(
    blocksName,
    PropsMode.Custom,
)<BlocksSchema, { children: RawChildren }>({
    type: ElementType.Block,
    name: blocksName,
    dataChildren({ tagName, children }) {
        if (!children) {
            throw new ProseError(
                `<${tagName}> requires at least one child element!`,
            );
        }

        return {
            data: undefined,
            children: children as JsxElement<BlockSchemaAny>[],
        };
    },
    childStep({ tagName, child }) {
        if (isInlinerElement(child)) {
            throw new ProseError(
                `<${tagName}> can only have block children, but detected inliner child <${child.tagName}>!`,
            );
        }
    },
});
