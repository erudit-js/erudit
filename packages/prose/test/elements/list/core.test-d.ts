import { describe, it } from 'vitest';

import { List } from '@src/elements/list/core';

describe('List', () => {
  it('should work fine when props do not intersect', () => {
    List({ ordered: true, children: [] });
    List({ unordered: true, children: [] });
  });

  it('should has mutually exclusive ordered/unordered props', () => {
    // @ts-expect-error
    List({ ordered: true, unordered: true, children: [] });
    // @ts-expect-error
    List({ unordered: true, start: 5, children: [] });
  });
});
