import { describe, it, expectTypeOf } from 'vitest';
import { defineSchema, type LinkableSchema, type Schema } from 'tsprose';

import { defineEruditTag } from '@src/tag';
import type { NoSnippet, SnippetRaw } from '@src/snippet';
import type { NoToc, TocRawElementProp } from '@src/toc';

describe('defineEruditTag', () => {
  it('should infer augmented properties for linkable schema', () => {
    interface TestLinkableSchema extends LinkableSchema {
      name: 'testLinkable';
      type: 'block';
      linkable: true;
      Data: undefined;
      Storage: undefined;
      Children: undefined;
    }

    const linkableSchema = defineSchema<TestLinkableSchema>({
      name: 'testLinkable',
      type: 'block',
      linkable: true,
    });

    defineEruditTag({
      tagName: 'LinkableTag',
      schema: linkableSchema,
    })(({ props, element }) => {
      expectTypeOf<typeof props.snippet>().toEqualTypeOf<
        SnippetRaw | undefined
      >();
      expectTypeOf<typeof element.snippet>().toEqualTypeOf<
        SnippetRaw | undefined
      >();
      expectTypeOf<typeof props.toc>().toEqualTypeOf<
        boolean | string | undefined
      >();
      expectTypeOf<typeof element.toc>().toEqualTypeOf<
        TocRawElementProp['toc'] | undefined
      >();
    });
  });

  it('should infer no augmented for unlinkable schema', () => {
    interface UnlinkableSchema extends Schema {
      name: 'testUnlinkable';
      type: 'block';
      linkable: false;
      Data: undefined;
      Storage: undefined;
      Children: undefined;
    }

    const unlinkableSchema = defineSchema<UnlinkableSchema>({
      name: 'testUnlinkable',
      type: 'block',
      linkable: false,
    });

    defineEruditTag({
      tagName: 'UnlinkableTag',
      schema: unlinkableSchema,
    })(({ props }) => {
      // @ts-expect-error No snippet prop on unlinkable schema
      props.snippet;
      // @ts-expect-error No toc prop on unlinkable schema
      props.toc;
    });
  });

  it('should respect NoSnippet and NoToc markers', () => {
    interface TestSchema extends LinkableSchema {
      name: 'testSchema';
      type: 'block';
      linkable: true;
      Data: undefined;
      Storage: undefined;
      Children: undefined;
    }

    const linkableSchema = defineSchema<TestSchema>({
      name: 'testSchema',
      type: 'block',
      linkable: true,
    });

    const noSnippetTag = defineEruditTag({
      tagName: 'NoSnippetTag',
      schema: linkableSchema,
    })<NoSnippet>(({ props }) => {
      // @ts-expect-error No `snippet` prop when NoSnippet is set
      props.snippet;
      expectTypeOf<typeof props.toc>().toEqualTypeOf<
        boolean | string | undefined
      >();
    });

    // No NO_SNIPPET_PREFIX property is required when NoSnippet is set
    noSnippetTag({});

    const noTocTag = defineEruditTag({
      tagName: 'NoTocTag',
      schema: linkableSchema,
    })<NoToc>(({ props }) => {
      expectTypeOf<typeof props.snippet>().toEqualTypeOf<
        SnippetRaw | undefined
      >();
      // @ts-expect-error No toc prop when NoToc is set
      props.toc;
    });

    // No NO_TOC_PREFIX property is required when NoToc is set
    noTocTag({});
  });
});
