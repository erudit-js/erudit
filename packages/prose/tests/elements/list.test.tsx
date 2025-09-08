import { describe, it, expect } from 'vitest';

import {
    Li,
    Ol,
    Ul,
    type ProseList,
    type ProseListItem,
} from 'src/elements/list/element.global';
import { ProseElementType } from 'src/element';

describe('List', () => {
    describe('Li', () => {
        it('should create a list item with single child', () => {
            const listItem = (
                <Li>
                    <p>Item content</p>
                </Li>
            );

            expect(listItem.type).toBe(ProseElementType.Block);
            expect(listItem.name).toBe('listItem');
            expect(listItem.data).toHaveLength(1);
        });

        it('should create a list item with multiple children', () => {
            const listItem = (
                <Li>
                    <p>First paragraph</p>
                    <p>Second paragraph</p>
                </Li>
            );

            expect(listItem.data).toHaveLength(2);
        });

        it('should throw error when no children provided', () => {
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
            ) as ProseList;

            expect(list.type).toBe(ProseElementType.Block);
            expect(list.name).toBe('list');
            expect((list.data as any).type).toBe('ul');
            expect((list.data as any).items).toHaveLength(1);
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
            ) as ProseList;

            expect((list.data as any).items).toHaveLength(3);
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
            )).toThrow('<Ul> can only have <Li> children!');
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
            ) as ProseList;

            expect(list.type).toBe(ProseElementType.Block);
            expect(list.name).toBe('list');
            expect((list.data as any).type).toBe('ol');
            expect((list.data as any).start).toBe(1);
            expect((list.data as any).items).toHaveLength(1);
        });

        it('should create an ordered list with start value of 0', () => {
            const list = (
                <Ol start={0}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            ) as ProseList;

            expect((list.data as any).start).toBe(0);
            expect((list.data as any).items).toHaveLength(1);
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
            ) as ProseList;

            expect((list.data as any).start).toBe(5);
            expect((list.data as any).items).toHaveLength(2);
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
            ) as ProseList;

            expect((list.data as any).items).toHaveLength(2);
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
            )).toThrow('<Ol> can only have <Li> children!');
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
                '<Ol> start prop must be a non-negative whole integer, got: -1',
            );

            expect(() => (
                <Ol start={-5}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).toThrow(
                '<Ol> start prop must be a non-negative whole integer, got: -5',
            );

            expect(() => (
                <Ol start={1.5}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).toThrow(
                '<Ol> start prop must be a non-negative whole integer, got: 1.5',
            );

            expect(() => (
                <Ol start={-2.7}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).toThrow(
                '<Ol> start prop must be a non-negative whole integer, got: -2.7',
            );

            expect(() => (
                <Ol start={'abc' as any}>
                    <Li>
                        <p>Item 1</p>
                    </Li>
                </Ol>
            )).toThrow(
                '<Ol> start prop must be a non-negative whole integer, got: abc',
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
            ) as ProseList;

            expect((nestedList.data as any).items).toHaveLength(2);
            expect(
                ((nestedList.data as any).items[0] as ProseListItem).data,
            ).toHaveLength(2);
        });
    });
});
