import { describe, it, expectTypeOf } from 'vitest';
import { defineSchema, type Schema } from 'tsprose';

import { defineEruditTag } from '@src/tag';
import {
  defineProseCoreElement,
  defineProseCoreElements,
  type ProseCoreElement,
} from '@src/coreElement';

describe('defineEruditProseCoreElement(s)', () => {
  interface FooSchema extends Schema {
    name: 'foo';
    type: 'block';
    linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: undefined;
  }

  const fooSchema = defineSchema<FooSchema>({
    name: 'foo',
    type: 'block',
    linkable: false,
  });

  const fooTag = defineEruditTag({
    tagName: 'FooTag',
    schema: fooSchema,
  })(() => {});

  const fooProseCoreElement = defineProseCoreElement({
    schema: fooSchema,
    tags: [fooTag],
    rawToProseHook: async () => {},
    dependencies: {
      katex: {
        optimize: true,
      },
    },
  });

  const coreElements = defineProseCoreElements(
    fooProseCoreElement,
    fooProseCoreElement,
  );

  it('should infer type of single core element', () => {
    expectTypeOf<typeof fooProseCoreElement>().toEqualTypeOf<{
      readonly schema: typeof fooSchema;
      readonly tags: [typeof fooTag];
      readonly rawToProseHook: () => Promise<void>;
      readonly dependencies: {
        readonly katex: {
          readonly optimize: true;
        };
      };
    }>();
  });

  it('should infer type of multiple core elements', () => {
    expectTypeOf<(typeof coreElements)[0]>().toEqualTypeOf<
      typeof fooProseCoreElement
    >();

    expectTypeOf<(typeof coreElements)[1]>().toEqualTypeOf<
      typeof fooProseCoreElement
    >();
  });

  it('specific types should be castable to general types', () => {
    expectTypeOf<typeof fooProseCoreElement>().toExtend<ProseCoreElement>();
  });
});
