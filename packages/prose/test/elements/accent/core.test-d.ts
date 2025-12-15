import { describe, expectTypeOf, it } from 'vitest';
import { schemaKind, type AnySchema, type ProseElement } from '@jsprose/core';

import {
    defineAccentCore,
    isAccentElement,
    isAccentMainElement,
    isAccentSectionElement,
    type AccentSchema,
    type AccentMainSchema,
    type AccentSectionSchema,
} from '@erudit-js/prose/elements/accent/core';

describe('Accent', () => {
    it('should constuct final object infering accent and section names in type level', () => {
        const fooAccent = defineAccentCore({
            name: 'foo',
            sectionNames: ['bar'],
        });

        expectTypeOf(fooAccent._sectionNames).toEqualTypeOf<['bar']>();

        expectTypeOf(
            fooAccent.accent.schema.name,
        ).toEqualTypeOf<'accent_foo'>();
        expectTypeOf(fooAccent.accent.schema.Children).toEqualTypeOf<
            [
                typeof fooAccent.main.schema,
                ...(typeof fooAccent.section.schema)[],
            ]
        >();
        expectTypeOf(fooAccent.accent.schema.SectionNames).toEqualTypeOf<
            ['bar']
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

        expectTypeOf(
            fooAccent.main.schema.name,
        ).toEqualTypeOf<'accentMain_foo'>();
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
        ).toEqualTypeOf<'accentSection_foo'>();
        expectTypeOf(fooAccent.section.schema.Data).toEqualTypeOf<
            { type: 'named'; name: string } | { type: 'manual'; title: string }
        >();

        const manualSectionTag = fooAccent.section.tags[0];
        expectTypeOf(manualSectionTag[schemaKind]).toEqualTypeOf(
            fooAccent.section.schema,
        );
        expectTypeOf(manualSectionTag.tagName).toEqualTypeOf<'FooSection'>();

        const barSectionTag = fooAccent.section.tags[1];
        expectTypeOf(barSectionTag[schemaKind]).toEqualTypeOf(
            fooAccent.section.schema,
        );
        expectTypeOf(barSectionTag.tagName).toEqualTypeOf<'FooBar'>();
    });

    it('should correctly type guard ProseElement accent types', () => {
        const element = {} as ProseElement<AnySchema>;

        // Test type narrowing for accent
        if (isAccentElement(element)) {
            expectTypeOf(element).toEqualTypeOf<ProseElement<AccentSchema>>();
        }

        // Test type narrowing for main section
        if (isAccentMainElement(element)) {
            expectTypeOf(element).toEqualTypeOf<
                ProseElement<AccentMainSchema>
            >();
        }

        // Test type narrowing for section
        if (isAccentSectionElement(element)) {
            expectTypeOf(element).toEqualTypeOf<
                ProseElement<AccentSectionSchema>
            >();
        }

        // Test return types
        expectTypeOf(isAccentElement(element)).toEqualTypeOf<boolean>();
        expectTypeOf(isAccentMainElement(element)).toEqualTypeOf<boolean>();
        expectTypeOf(isAccentSectionElement(element)).toEqualTypeOf<boolean>();
    });
});
