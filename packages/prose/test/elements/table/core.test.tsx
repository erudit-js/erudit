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

  it('should store hspan in data', () => {
    const row = asEruditRaw(
      <Tr>
        <Td hspan={2}>Wide</Td>
        <Td>Normal</Td>
      </Tr>,
    );
    expect(row.children![0].data).toEqual({ hspan: 2 });
    expect(row.children![1].data).toBeUndefined();
  });

  it('should store vspan in data', () => {
    const row = asEruditRaw(
      <Tr>
        <Td vspan={3}>Tall</Td>
        <Td>Normal</Td>
      </Tr>,
    );
    expect(row.children![0].data).toEqual({ vspan: 3 });
    expect(row.children![1].data).toBeUndefined();
  });

  it('should store both hspan and vspan together in data', () => {
    const row = asEruditRaw(
      <Tr>
        <Td hspan={2} vspan={3}>
          Big
        </Td>
      </Tr>,
    );
    expect(row.children![0].data).toEqual({ hspan: 2, vspan: 3 });
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
