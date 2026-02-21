import type { RawToProseSchemaHook } from '@src/rawToProse/hook';
import type { Schema } from 'tsprose';
import { describe, expectTypeOf, it } from 'vitest';

describe('RawToProseSchemaHook', () => {
  interface TestSchema extends Schema {
    name: 'testSchema';
    type: 'block';
    Data: {
      value: string;
    };
    Storage: number;
    Children: TestSchema[] | undefined;
  }

  it('should widen correctly', () => {
    type TestSchemaHook = RawToProseSchemaHook<TestSchema>;
    expectTypeOf<TestSchemaHook>().toExtend<RawToProseSchemaHook>();
  });
});
