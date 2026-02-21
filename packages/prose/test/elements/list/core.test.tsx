import { describe, expect, it } from 'vitest';
import { isRawElement } from 'tsprose';

import { asEruditRaw } from '@src/rawElement';
import {
  Li,
  List,
  listItemSchema,
  type ListSchema,
} from '@src/elements/list/core';
import { P, paragraphSchema } from '@src/elements/paragraph/core';

describe('List Item', () => {
  it('should correctly create ul list', () => {
    const ulList = asEruditRaw<ListSchema>(
      <List unordered>
        <Li>Item 1</Li>
        <Li>
          <P>Item 2</P>
        </Li>
      </List>,
    );

    expect(ulList.data).toEqual({ type: 'unordered' });
    expect(ulList.children).toHaveLength(2);

    expect(isRawElement(ulList.children![0], listItemSchema)).toBe(true);
    expect(isRawElement(ulList.children![1], listItemSchema)).toBe(true);

    expect(
      isRawElement(ulList.children![0].children![0], paragraphSchema),
    ).toBe(true);
    expect(
      isRawElement(ulList.children![1].children![0], paragraphSchema),
    ).toBe(true);
  });

  it('should correctly create ol list with/without start attribute', () => {
    expect(
      asEruditRaw<ListSchema>(
        <List ordered>
          <Li>Item</Li>
        </List>,
      ).data,
    ).toEqual({ type: 'ordered', start: 1 });

    expect(
      asEruditRaw<ListSchema>(
        <List ordered start={10}>
          <Li>Item</Li>
        </List>,
      ).data,
    ).toEqual({ type: 'ordered', start: 10 });
  });
});
