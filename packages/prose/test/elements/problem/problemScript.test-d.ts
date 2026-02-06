import { describe, expectTypeOf, it } from 'vitest';
import type {
  WrapSchemas,
  AnySchema,
  RawElement,
  Unique,
  AutoUnique,
} from '@jsprose/core';

import { defineProblemScript } from '@erudit-js/prose/elements/problem/problemScript';
import { P } from '@erudit-js/prose/elements/paragraph/core';
import type { ProblemContentChild } from '@erudit-js/prose/elements/problem/problemContent';
import { Video } from '@erudit-js/prose/elements/video/core';

describe('Problem Script', () => {
  const autoUnique = () => undefined as any as AutoUnique;

  it('should infer correct types for no uniques and no generator', () => {
    const minimalScript = defineProblemScript()((args) => {
      expectTypeOf(args).toEqualTypeOf<{}>();

      // @ts-expect-error
      args.uniques;
      // @ts-expect-error
      args.initial;
      // @ts-expect-error
      args.random;

      return undefined as any as RawElement<AnySchema>;
    });

    // @ts-expect-error
    minimalScript(autoUnique);

    // @ts-expect-error
    minimalScript({
      foo: autoUnique,
      bar: autoUnique,
    });

    const instance = minimalScript();

    expectTypeOf(instance.generate().problemContent).toEqualTypeOf<
      WrapSchemas<'raw-prose', ProblemContentChild>[]
    >();
  });

  it('should infer correct types for uniques and generator', () => {
    const uniquesWithGenerator = defineProblemScript({
      isGenerator: true,
      uniques: {
        myP: P,
        myVideo: Video,
      },
    })(({ uniques, initial, random }) => {
      const { myP, myVideo } = uniques;

      expectTypeOf(myP).toEqualTypeOf<Unique<typeof P>>();
      expectTypeOf(myVideo).toEqualTypeOf<Unique<typeof Video>>();

      return undefined as any as RawElement<AnySchema>;
    });

    // @ts-expect-error
    uniquesWithGenerator(3);

    uniquesWithGenerator(autoUnique);

    uniquesWithGenerator({
      myP: autoUnique,
      myVideo: autoUnique,
    });

    const myPUnique = undefined as any as Unique<typeof P>;

    const instance = uniquesWithGenerator({
      myP: myPUnique,
      myVideo: autoUnique,
    });

    expectTypeOf(instance.generate('some-seed').problemContent).toEqualTypeOf<
      WrapSchemas<'raw-prose', ProblemContentChild>[]
    >();
  });
});
