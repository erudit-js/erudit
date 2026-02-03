import { describe, expectTypeOf, it } from 'vitest';

import { defineResolveStep } from '@erudit-js/prose';

describe('defineResolveStep', () => {
  it('should infer step function return type', () => {
    const step = defineResolveStep(async (args) => {
      if (args) {
        return 5;
      }
    });

    expectTypeOf<ReturnType<typeof step>>().toEqualTypeOf<
      Promise<5 | undefined>
    >();
  });
});
