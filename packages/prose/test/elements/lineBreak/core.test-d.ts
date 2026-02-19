import { describe, expectTypeOf, it } from 'vitest';

import { type Br } from '@src/elements/lineBreak/core';

describe('Link break', () => {
  it('should not accept any props and children', () => {
    expectTypeOf<Parameters<typeof Br>[0]>().toEqualTypeOf<{
      children?: undefined;
    }>();

    // @ts-expect-error
    Br({ children: 3 });
  });
});
