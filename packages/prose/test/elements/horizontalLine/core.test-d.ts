import { describe, expectTypeOf, it } from 'vitest';

import { type Hr } from '@src/elements/horizontalLine/core';

describe('Horizontal line', () => {
  it('should not accept any props and children', () => {
    expectTypeOf<Parameters<typeof Hr>[0]>().toEqualTypeOf<{
      children?: undefined;
    }>();

    // @ts-expect-error
    Hr({ children: 3 });
  });
});
