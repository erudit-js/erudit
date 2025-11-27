import { describe, expect, it } from 'vitest';
import { isolateProse, isRawElement, PROSE_REGISTRY } from '@jsprose/core';

import {
    Caption,
    captionRegistryItem,
    captionSchema,
} from '@erudit-js/prose/elements/caption/core';
import {
    Td,
    Tr,
    Table,
    tableDataRegistryItem,
    tableRegistryItem,
    tableRowRegistryItem,
    tableRowSchema,
    tableDataSchema,
} from '@erudit-js/prose/elements/table/core';
import { asEruditRaw } from '@erudit-js/prose';

const prepareRegistry = () =>
    PROSE_REGISTRY.setItems(
        tableDataRegistryItem,
        tableRowRegistryItem,
        tableRegistryItem,
        captionRegistryItem,
    );

describe('Table', () => {
    it('should create table with rows and data correctly', () => {
        isolateProse(() => {
            prepareRegistry();

            const table = asEruditRaw(
                <Table>
                    <Tr>
                        <Td>Cell 1</Td>
                        <Td>Cell 2</Td>
                    </Tr>
                    <Caption>Table Caption</Caption>
                </Table>,
            );

            expect(table.children).toHaveLength(2);
            const row = table.children![0];
            expect(isRawElement(row, tableRowSchema)).toBe(true);
            expect(row.children).toHaveLength(2);
            expect(isRawElement(row.children![0], tableDataSchema)).toBe(true);
            expect(isRawElement(row.children![1], tableDataSchema)).toBe(true);
            expect(isRawElement(table.children![1], captionSchema)).toBe(true);
        });
    });

    it('should throw when wrong children are provided', () => {
        isolateProse(() => {
            prepareRegistry();

            expect(() => <Tr>Not Td</Tr>).toThrow();
            expect(() => <Table>Not Tr</Table>).toThrow();
            expect(() => (
                <Table>
                    <Td>Foo</Td>
                </Table>
            )).toThrow();
        });
    });
});
