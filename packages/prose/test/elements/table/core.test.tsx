import { describe, expect, it } from 'vitest';
import { isRawElement } from 'tsprose';

import { asEruditRaw } from '@src/rawElement';
import {
  Table,
  tableDataSchema,
  tableRowSchema,
  Td,
  Tr,
  type TableSchema,
} from '@src/elements/table/core';
import { Caption, captionSchema } from '@src/elements/caption/core';

describe('Table', () => {
  it('should create table with rows and data correctly', () => {
    const table = asEruditRaw<TableSchema>(
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

  it('should throw when wrong children are provided', () => {
    expect(() => <Tr>Not Td</Tr>).toThrow();
    expect(() => <Table>Not Tr</Table>).toThrow();
    expect(() => (
      <Table>
        <Td>Foo</Td>
      </Table>
    )).toThrow();
  });
});
