import { describe, it, expect } from 'vitest';

import { type ListSchema, type ListItemSchema } from 'src/elements/list/schema';
import { Ul, Ol, Li } from 'src/elements/list/tags';
import { ElementType } from 'src/type';
import type { JsxElement } from 'src/element';

describe('List', () => {
    describe('Li', () => {
        it('should create a list item with single child', () => {
            const listItem = (
                <Li>
                    <p>Item content</p>
                </Li>
            );

            expect(listItem.type).toBe(ElementType.Block);
            expect(listItem.name).toBe('listItem');
            expect(listItem.children).toHaveLength(1);
        });

        it('should create a list item with multiple children', () => {
            const listItem = (
                <Li>
                    <p>First paragraph</p>
                    <p>Second paragraph</p>
                </Li>
            );

            expect(listItem.children).toHaveLength(2);
        });

        it('should throw error when no children provided', () => {
            // @ts-expect-error Empty children
            expect(() => <Li></Li>).toThrow(
                '<Li> requires at least one child element!',
            );
        });
    });

    describe('Ul', () => {
        it('should create an unordered list with single item', () => {
            const list = (
                <Ul>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ul>
            ) as JsxElement<ListSchema>;

            expect(list.type).toBe(ElementType.Block);
            expect(list.name).toBe('list');
            expect((list.data as any).type).toBe('unordered');
            expect(list.children).toHaveLength(1);
        });

        it('should create an unordered list with multiple items', () => {
            const list = (
                <Ul>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                    <Li>
                        <p>Item 2</p>
                    </Li>
                    <Li>
                        <p>Item 3</p>
                    </Li>
                </Ul>
            ) as JsxElement<ListSchema>;

            expect(list.children).toHaveLength(3);
        });

        it('should throw error when no children provided', () => {
            expect(() => <Ul></Ul>).toThrow(
                '<Ul> requires at least one <Li> child element!',
            );
        });

        it('should throw error when non-Li children provided', () => {
            expect(() => (
                <Ul>
                    <p>Invalid child</p>
                </Ul>
            )).toThrow(
                '<Ul> only accepts <Li> child elements, but received <p>!',
            );
        });
    });

    describe('Ol', () => {
        it('should create an ordered list with default start value', () => {
            const list = (
                <Ol>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            ) as JsxElement<ListSchema>;

            expect(list.type).toBe(ElementType.Block);
            expect(list.name).toBe('list');
            expect((list.data as any).type).toBe('ordered');
            expect((list.data as any).start).toBe(1);
            expect(list.children).toHaveLength(1);
        });

        it('should create an ordered list with start value of 0', () => {
            const list = (
                <Ol start={0}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            ) as JsxElement<ListSchema>;

            expect((list.data as any).start).toBe(0);
            expect(list.children).toHaveLength(1);
        });

        it('should create an ordered list with custom start value', () => {
            const list = (
                <Ol start={5}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                    <Li>
                        <p>Item 2</p>
                    </Li>
                </Ol>
            ) as JsxElement<ListSchema>;

            expect((list.data as any).start).toBe(5);
            expect(list.children).toHaveLength(2);
        });

        it('should create an ordered list with multiple items', () => {
            const list = (
                <Ol start={3}>
                    <Li>
                        <p>First item</p>
                    </Li>
                    <Li>
                        <p>Second item</p>
                        <p>With multiple paragraphs</p>
                    </Li>
                </Ol>
            ) as JsxElement<ListSchema>;

            expect(list.children).toHaveLength(2);
            expect((list.data as any).start).toBe(3);
        });

        it('should throw error when no children provided', () => {
            expect(() => <Ol></Ol>).toThrow(
                '<Ol> requires at least one <Li> child element!',
            );
        });

        it('should throw error when non-Li children provided', () => {
            expect(() => (
                <Ol>
                    <p>Invalid child</p>
                </Ol>
            )).toThrow(
                '<Ol> only accepts <Li> child elements, but received <p>!',
            );
        });

        it('should validate start prop is a non-negative whole integer', () => {
            expect(() => (
                <Ol start={0}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).not.toThrow();

            expect(() => (
                <Ol start={5}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).not.toThrow();

            expect(() => (
                <Ol start={-1}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).toThrow(
                '<Ol> start prop must be a non-negative integer, but received "-1"!',
            );

            expect(() => (
                <Ol start={-5}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).toThrow(
                '<Ol> start prop must be a non-negative integer, but received "-5"!',
            );

            expect(() => (
                <Ol start={1.5}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).toThrow(
                '<Ol> start prop must be a non-negative integer, but received "1.5"!',
            );

            expect(() => (
                <Ol start={-2.7}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).toThrow(
                '<Ol> start prop must be a non-negative integer, but received "-2.7"!',
            );

            expect(() => (
                <Ol start={'abc' as any}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).toThrow(
                '<Ol> start prop must be a non-negative integer, but received "abc"!',
            );
        });
    });

    describe('Nested lists', () => {
        it('should create nested lists correctly', () => {
            const nestedList = (
                <Ul>
                    <Li>
                        <p>Top level item</p>
                        <Ol start={1}>
                            <Li>
                                <p>Nested item 1</p>
                            </Li>
                            <Li>
                                <p>Nested item 2</p>
                            </Li>
                        </Ol>
                    </Li>
                    <Li>
                        <p>Another top level item</p>
                    </Li>
                </Ul>
            ) as JsxElement<ListSchema>;

            expect(nestedList.children as any).toHaveLength(2);
            expect(
                ((nestedList.children as any)[0] as JsxElement<ListItemSchema>)
                    .children,
            ).toHaveLength(2);
        });
    });
});
