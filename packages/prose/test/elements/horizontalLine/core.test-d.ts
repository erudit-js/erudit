import { describe, expectTypeOf, it } from 'vitest';
import { isolateProse } from '@jsprose/core';

import { Hr } from '@erudit-js/prose/elements/horizontalLine/core';

describe('Horizontal line', () => {
  it('should not accept any props and children', () => {
    isolateProse(() => {
      expectTypeOf<Parameters<typeof Hr>[0]>().toEqualTypeOf<{
        children?: undefined;
      }>();

      // @ts-expect-error
      Hr({ children: 3 });
    });
  });
});
