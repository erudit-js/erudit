import { describe, expectTypeOf, it } from 'vitest';
import type { RawElement, Schema, ToRawElement } from 'tsprose';

import {
  asEruditRaw,
  type EruditRawElement,
  type ToEruditRawElement,
} from '@src/rawElement';

describe('Erudit Raw Element', () => {
  it('should widen correctly', () => {
    expectTypeOf<EruditRawElement>().toExtend<RawElement>();
  });
});

describe('asEruditRawElement', () => {
  it('should infer schema types', () => {
    interface TestSchema extends Schema {
      name: 'test';
      type: 'block';
      linkable: 'always';
      Data: string;
      Storage: undefined;
      Children: TestSchema[];
    }

    type TestRawElement = ToRawElement<TestSchema>;
    type EruditTestRawElement = ToEruditRawElement<TestSchema>;

    const result = asEruditRaw<TestSchema>({} as TestRawElement);
    expectTypeOf<typeof result>().toEqualTypeOf<EruditTestRawElement>();
  });
});
