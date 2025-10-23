import {
    ensureHasChildren,
    ensureInlinerChild,
    type RawChildren,
} from '../../children';
import { isElement, type JsxElement } from '../../element';
import { ProseError } from '../../error';
import { defineGlobalElement } from '../../globalElement';
import type { ElementSchema, InlinerSchemaAny } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { Caption, type CaptionSchema } from '../caption/caption.global';

//
// Td
//

export const tdName = 'td';

export type TDSchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof tdName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: InlinerSchemaAny[] | undefined;
}>;

export const Td = defineTag('Td')<TDSchema>({
    type: ElementType.Inliner,
    name: tdName,
    linkable: false,
    initElement({ tagName, element, children }) {
        if (children) {
            ensureHasChildren(tagName, children);
            element.children = children as JsxElement<InlinerSchemaAny>[];
        }
    },
    childStep({ tagName, child }) {
        ensureInlinerChild(tagName, child);

        if (isElement(child, Td)) {
            throw new ProseError(
                `<${tagName}> cannot contain another <${tdName}> element.`,
            );
        }

        if (isElement(child, Tr)) {
            throw new ProseError(
                `<${tagName}> cannot contain <${trName}> elements.`,
            );
        }
    },
});

//
// Tr
//

export const trName = 'tr';

export type TRSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof trName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: TDSchema[];
}>;

export const Tr = defineTag('Tr')<TRSchema, { children: RawChildren }>({
    type: ElementType.Block,
    name: trName,
    linkable: false,
    initElement({ tagName, element, children }) {
        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<TDSchema>[];
    },
    childStep({ tagName, child }) {
        if (!isElement(child, Td)) {
            throw new ProseError(
                `<${tagName}> can only contain <${tdName}> elements as children.`,
            );
        }
    },
});

//
// Table
//

export const tableName = 'table';

export type TableSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof tableName;
    Linkable: true;
    Data: undefined;
    Storage: undefined;
    Children: (TRSchema | CaptionSchema)[];
}>;

export const Table = defineTag('Table')<TableSchema>({
    type: ElementType.Block,
    name: tableName,
    linkable: true,
    initElement({ tagName, element, children }) {
        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<TRSchema>[];
    },
    childStep({ tagName, child }) {
        if (!isElement(child, Tr) && !isElement(child, Caption)) {
            throw new ProseError(
                `<${tagName}> can only contain <${trName}> elements as children, and an optional <Caption> as the last child.`,
            );
        }
    },
});

//
// Default
//

export default [
    defineGlobalElement<TDSchema>()({
        name: tdName,
        tags: { Td },
    }),
    defineGlobalElement<TRSchema>()({
        name: trName,
        tags: { Tr },
    }),
    defineGlobalElement<TableSchema>()({
        name: tableName,
        tags: { Table },
    }),
];
