import type { RawChildren } from '../../children';
import type { JsxElement } from '../../element';
import { ProseError } from '../../error';
import type { ElementSchemaAny } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import {
    listItemName,
    listName,
    type ListItemSchema,
    type ListSchema,
} from './schema';

//
// List Item
//

export const Li = defineTag('Li')<ListItemSchema, { children: RawChildren }>({
    type: ElementType.Block,
    name: listItemName,
    linkable: false,
    initElement({ children, element, tagName }) {
        if (!children || children.length === 0) {
            throw new ProseError(
                `<${tagName}> requires at least one child element!`,
            );
        }

        const firstChildType = children[0].type;
        for (let i = 1; i < children.length; i++) {
            if (children[i].type !== firstChildType) {
                throw new ProseError(
                    `<${tagName}> children must all have the same type! Expected ${firstChildType}, but found ${children[i].type} <${children[i].tagName}> at index ${i}!`,
                );
            }
        }

        element.data = firstChildType;
        element.children = children as JsxElement<ElementSchemaAny>[];
    },
});

//
// List
//

export const Ol = defineTag('Ol')<ListSchema, { start?: number }>({
    type: ElementType.Block,
    name: listName,
    linkable: true,
    initElement({ children, element, tagName, props }) {
        if (!children) {
            throw new ProseError(
                `<${tagName}> requires at least one <Li> child element!`,
            );
        }

        let startValue = 1;
        if (props.start !== undefined) {
            const start = Number(props.start);
            if (!Number.isInteger(start) || start < 0) {
                throw new ProseError(
                    `<${tagName}> start prop must be a non-negative integer, but received "${props.start}"!`,
                );
            }
            startValue = start;
        }

        element.data = {
            type: 'ordered',
            start: startValue,
        };

        element.children = children as JsxElement<ListItemSchema>[];
    },
    childStep: validateLi,
});

export const Ul = defineTag('Ul')<ListSchema>({
    type: ElementType.Block,
    name: listName,
    linkable: true,
    initElement({ children, element, tagName }) {
        if (!children) {
            throw new ProseError(
                `<${tagName}> requires at least one <Li> child element!`,
            );
        }

        element.data = { type: 'unordered' };
        element.children = children as JsxElement<ListItemSchema>[];
    },
    childStep: validateLi,
});

function validateLi({
    tagName,
    child,
}: {
    tagName: string;
    child: JsxElement<ElementSchemaAny>;
}) {
    if (!Li.isTagElement(child)) {
        throw new ProseError(
            `<${tagName}> only accepts <Li> child elements, but received <${child.tagName}>!`,
        );
    }
}
