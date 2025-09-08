import { defineTag, isTagElement, type ProseGlobalProps } from '../../tag';
import {
    ProseElementType,
    type ProseElement,
    type ProseElementAny,
} from '../../element';
import { defineGlobalElement } from '../../global';

//
// List Item
//

export const listItemName = 'listItem';

export type ProseListItem = ProseElement<
    ProseElementType.Block,
    typeof listItemName,
    ProseElementAny[]
>;

export type ListItemProps = {};

export const Li = defineTag<ProseListItem, ListItemProps>({
    type: ProseElementType.Block,
    name: listItemName,
    createData({ children }) {
        if (!children || children.length === 0) {
            throw new Error(`<Li> requires at least one child element!`);
        }
        return children;
    },
});

//
// List
//

export const listName = 'list';

export type ProseList = ProseElement<
    ProseElementType.Block,
    typeof listName,
    ({ type: 'ol'; start: number } | { type: 'ul' }) & {
        items: ProseListItem[];
    }
>;

export type UlListProps = ProseGlobalProps<ProseList>;
export type OlListProps = ProseGlobalProps<ProseList> & { start?: number };

export const Ul = defineTag<ProseList, UlListProps>({
    type: ProseElementType.Block,
    name: listName,
    createData({ children }) {
        if (!children || children.length === 0) {
            throw new Error(`<Ul> requires at least one <Li> child element!`);
        }
        return { type: 'ul', items: children as ProseListItem[] };
    },
    childStep(child) {
        if (!isTagElement(child, Li)) {
            throw new Error(`<Ul> can only have <Li> children!`);
        }
    },
});

export const Ol = defineTag<ProseList, OlListProps>({
    type: ProseElementType.Block,
    name: listName,
    createData({ children, props }) {
        if (!children || children.length === 0) {
            throw new Error(`<Ol> requires at least one <Li> child element!`);
        }

        let start: number;
        if (props.start !== undefined) {
            start = props.start;
            if (!Number.isInteger(start) || start < 0) {
                throw new Error(
                    `<Ol> start prop must be a non-negative whole integer, got: ${start}`,
                );
            }
        } else {
            start = 1;
        }

        return {
            type: 'ol',
            start,
            items: children as ProseListItem[],
        };
    },
    childStep(child) {
        if (!isTagElement(child, Li)) {
            throw new Error(`<Ol> can only have <Li> children!`);
        }
    },
});

//
// Global Element
//

export default defineGlobalElement<[ProseListItem, ProseList]>({
    tags: {
        Li,
        Ul,
        Ol,
    },
});
