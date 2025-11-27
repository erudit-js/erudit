import { describe, expectTypeOf, it } from 'vitest';
import { schemaKind, type TagChildren } from '@jsprose/core';

import { defineAccent } from '@erudit-js/prose/elements/accent/core';

describe('Accent', () => {
    it('should constuct final object infering accent and section names in type level', () => {
        const fooAccent = defineAccent({
            name: 'foo',
            sectionNames: ['bar'],
        });

        expectTypeOf(fooAccent._sectionNames).toEqualTypeOf<['bar']>();

        expectTypeOf(fooAccent.accent.schema.name).toEqualTypeOf<'foo'>();
        expectTypeOf(fooAccent.accent.schema.Children).toEqualTypeOf<
            [
                typeof fooAccent.main.schema,
                ...(
                    | typeof fooAccent.bar.schema
                    | typeof fooAccent.section.schema
                )[],
            ]
        >();
        expectTypeOf(fooAccent.accent.tag.tagName).toEqualTypeOf<'Foo'>();
        expectTypeOf(fooAccent.accent.tag[schemaKind]).toEqualTypeOf(
            fooAccent.accent.schema,
        );
        expectTypeOf(fooAccent.accent.registryItem).toEqualTypeOf({
            schema: fooAccent.accent.schema,
            tags: {
                [fooAccent.accent.tag.tagName]: fooAccent.accent.tag,
            },
            createStorage: undefined,
        });
        expectTypeOf<
            Parameters<typeof fooAccent.accent.tag>[0]['title']
        >().toEqualTypeOf<string>();

        expectTypeOf(fooAccent.main.schema.name).toEqualTypeOf<'fooMain'>();
        expectTypeOf(fooAccent.main.tag[schemaKind]).toEqualTypeOf(
            fooAccent.main.schema,
        );
        expectTypeOf(fooAccent.main.registryItem).toEqualTypeOf({
            schema: fooAccent.main.schema,
            tags: {
                [fooAccent.main.tag.tagName]: fooAccent.main.tag,
            },
            createStorage: undefined,
        });

        expectTypeOf(
            fooAccent.section.schema.name,
        ).toEqualTypeOf<'fooSection'>();
        expectTypeOf(fooAccent.section.tag[schemaKind]).toEqualTypeOf(
            fooAccent.section.schema,
        );
        expectTypeOf(fooAccent.section.registryItem).toEqualTypeOf({
            schema: fooAccent.section.schema,
            tags: {
                [fooAccent.section.tag.tagName]: fooAccent.section.tag,
            },
            createStorage: undefined,
        });
        expectTypeOf<
            Parameters<typeof fooAccent.section.tag>[0]
        >().toEqualTypeOf<
            {
                title: string;
            } & TagChildren
        >();

        expectTypeOf(fooAccent.bar.schema.name).toEqualTypeOf<'fooBar'>();
        expectTypeOf(fooAccent.bar.schema.Data).toEqualTypeOf<{
            name: 'bar';
        }>();
        expectTypeOf(fooAccent.bar.tag.tagName).toEqualTypeOf<'FooBar'>();
        expectTypeOf(fooAccent.bar.tag[schemaKind]).toEqualTypeOf(
            fooAccent.bar.schema,
        );
        expectTypeOf(fooAccent.bar.registryItem).toEqualTypeOf({
            schema: fooAccent.bar.schema,
            tags: {
                [fooAccent.bar.tag.tagName]: fooAccent.bar.tag,
            },
            createStorage: undefined,
        });
    });
});
