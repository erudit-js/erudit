import { describe, expectTypeOf, it } from 'vitest';
import { isolateProse } from '@jsprose/core';

import { Br } from '@erudit-js/prose/elements/lineBreak/core';

describe('Link break', () => {
  it('should not accept any props and children', () => {
    isolateProse(() => {
      expectTypeOf<Parameters<typeof Br>[0]>().toEqualTypeOf<{
        children?: undefined;
      }>();

      // @ts-expect-error
      Br({ children: 3 });
    });
  });
});
