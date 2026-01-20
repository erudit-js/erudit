import { describe, it, expectTypeOf } from 'vitest';
import { defineSchema, type NoTagChildren } from '@jsprose/core';

import {
    defineEruditTag,
    type NoSnippet,
    type NoToc,
    type ObjRawElementToc,
    type SnippetData,
} from '@erudit-js/prose';

describe('defineEruditTag', () => {
    it('should infer augmented properties for linkable schema', () => {
        const linkableSchema = defineSchema({
            name: 'linkable',
            type: 'block',
            linkable: true,
        })<{ Data: undefined; Storage: undefined; Children: undefined }>();

        defineEruditTag({
            tagName: 'LinkableTag',
            schema: linkableSchema,
        })<NoTagChildren>(({ props, element }) => {
            expectTypeOf<typeof props.snippet>().toEqualTypeOf<
                SnippetData | undefined
            >();
            expectTypeOf<typeof element.snippet>().toEqualTypeOf<
                SnippetData | undefined
            >();
            expectTypeOf<typeof props.toc>().toEqualTypeOf<
                boolean | string | undefined
            >();
            expectTypeOf<typeof element.toc>().toEqualTypeOf<
                ObjRawElementToc['toc'] | undefined
            >();
        });
    });

    it('should infer no augmented for unlinkable schema', () => {
        const unlinkableSchema = defineSchema({
            name: 'unlinkable',
            type: 'block',
            linkable: false,
        })<{ Data: undefined; Storage: undefined; Children: undefined }>();

        defineEruditTag({
            tagName: 'UnlinkableTag',
            schema: unlinkableSchema,
        })<NoTagChildren>(({ props }) => {
            // @ts-expect-error No snippet prop on unlinkable schema
            props.snippet;
            // @ts-expect-error No toc prop on unlinkable schema
            props.toc;
        });
    });

    it('should respect NoSnippet and NoToc markers', () => {
        const linkableSchema = defineSchema({
            name: 'linkable',
            type: 'block',
            linkable: true,
        })<{ Data: undefined; Storage: undefined; Children: undefined }>();

        const noSnippetTag = defineEruditTag({
            tagName: 'NoSnippetTag',
            schema: linkableSchema,
        })<NoTagChildren & NoSnippet>(({ props }) => {
            // @ts-expect-error No snippet prop when __noSnippet is set
            props.snippet;
            expectTypeOf<typeof props.toc>().toEqualTypeOf<
                boolean | string | undefined
            >();
        });

        noSnippetTag({
            /* No phantom NoSnippet property required */
        });

        const noTocTag = defineEruditTag({
            tagName: 'NoTocTag',
            schema: linkableSchema,
        })<NoTagChildren & NoToc>(({ props }) => {
            expectTypeOf<typeof props.snippet>().toEqualTypeOf<
                SnippetData | undefined
            >();
            // @ts-expect-error No toc prop when __noToc is set
            props.toc;
        });

        noTocTag({
            /* No phantom NoToc property required */
        });
    });
});
