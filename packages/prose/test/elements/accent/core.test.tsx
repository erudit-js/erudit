import { describe, expect, it } from 'vitest';
import { isolateProse, isRawElement, PROSE_REGISTRY } from '@jsprose/core';

import { asEruditRaw } from '@erudit-js/prose';
import {
    P,
    paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';
import {
    defineAccentCore,
    isAccentElement,
    isAccentMainElement,
    isAccentSectionElement,
} from '@erudit-js/prose/elements/accent/core';

describe('Accent', () => {
    it('should throw when invalid accent and section names are used', () => {
        expect(() =>
            defineAccentCore({
                name: 'Name',
                sectionNames: [],
            }),
        ).toThrow();

        expect(() =>
            defineAccentCore({
                name: 'accent',
                sectionNames: ['Foo'],
            }),
        ).toThrow();

        expect(() => {
            defineAccentCore({
                name: 'accent',
                sectionNames: ['section'], // Reserved
            });
        }).toThrow();

        expect(() => {
            defineAccentCore({
                name: 'accent',
                sectionNames: ['main'], // Reserved
            });
        }).toThrow();
    });

    const fooAccent = defineAccentCore({
        name: 'foo',
        sectionNames: ['bar'],
    });

    const Foo = fooAccent.accent.tag;
    const FooMain = fooAccent.main.tag;
    const FooSection = fooAccent.section.tags[0];
    const FooBar = fooAccent.section.tags[1];

    const registryItems = [
        fooAccent.accent.registryItem,
        fooAccent.main.registryItem,
        fooAccent.section.registryItem,
        // Note: fooAccent.bar.registryItem is the same as fooAccent.section.registryItem
    ] as const;

    it('should constuct final object infering accent and section names in runtime', () => {
        expect(fooAccent._sectionNames).toEqual(['bar']);

        expect(fooAccent.accent.schema.name).toBe('accent_foo');
        expect(fooAccent.accent.tag.tagName).toBe('Foo');
        expect(fooAccent.main.schema.name).toBe('accentMain_foo');
        expect(fooAccent.section.schema.name).toBe('accentSection_foo');
        expect(fooAccent.section.tags[1].schemaName).toBe('accentSection_foo');

        expect(fooAccent.accent.tag.tagName).toBe('Foo');
        expect(fooAccent.main.tag.tagName).toBe('FooMain');
        expect(fooAccent.section.tags[0].tagName).toBe('FooSection');
        expect(fooAccent.section.tags[1].tagName).toBe('FooBar');

        expect(fooAccent.accent.registryItem.schema).toBe(
            fooAccent.accent.schema,
        );
        expect(fooAccent.main.registryItem.schema).toBe(fooAccent.main.schema);
        expect(fooAccent.section.registryItem.schema).toBe(
            fooAccent.section.schema,
        );
        expect(fooAccent.section.registryItem.schema).toBe(
            fooAccent.section.schema,
        );
    });

    it('should be usable in JSX', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(paragraphRegistryItem, ...registryItems);

            const fooRawElement = asEruditRaw(
                <Foo title="Accent Title">
                    <FooMain>
                        <P>Some main content.</P>
                    </FooMain>
                    <FooSection title="Section Title">
                        <P>Some section content.</P>
                    </FooSection>
                    <FooBar>
                        <P>Some bar content.</P>
                    </FooBar>
                </Foo>,
            );

            expect(isRawElement(fooRawElement, fooAccent.accent.schema)).toBe(
                true,
            );
            expect(fooRawElement.title).toBe('Accent Title');

            expect(
                isRawElement(fooRawElement.children![0], fooAccent.main.schema),
            ).toBe(true);
            expect(
                isRawElement(
                    fooRawElement.children![1],
                    fooAccent.section.schema,
                ),
            ).toBe(true);
            expect(fooRawElement.children![1].data).toEqual({
                type: 'manual',
                title: 'Section Title',
            });
            expect(
                isRawElement(
                    fooRawElement.children![2],
                    fooAccent.section.schema,
                ),
            ).toBe(true);
            expect(fooRawElement.children![2].data).toEqual({
                type: 'named',
                name: 'bar',
            });
        });
    });

    it('should throw when accent root tag has not accent-related children', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(paragraphRegistryItem, ...registryItems);

            expect(() => (
                <Foo title="Accent Title">
                    <P>Invalid child</P>
                </Foo>
            )).toThrow();
        });
    });

    it('should throw when accent or section title is empty', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(paragraphRegistryItem, ...registryItems);

            expect(() => (
                <Foo title="">
                    <FooMain>
                        <P>Some main content.</P>
                    </FooMain>
                </Foo>
            )).toThrow(/title/);

            expect(() => (
                <Foo title="Accent Title">
                    <FooSection title="">
                        <P>Some section content.</P>
                    </FooSection>
                </Foo>
            )).toThrow(/title/);
        });
    });

    it('should throw when main section is missing', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(paragraphRegistryItem, ...registryItems);

            expect(() => (
                <Foo title="Accent Title">
                    <FooSection title="Section Title">
                        <P>Some section content.</P>
                    </FooSection>
                </Foo>
            )).toThrow(/FooMain/);
        });
    });

    it('should provide type guards for ProseElement accent types', () => {
        const mockAccentElement = { schemaName: 'accent_foo' } as any;
        const mockMainElement = { schemaName: 'accentMain_foo' } as any;
        const mockSectionElement = {
            schemaName: 'accentSection_foo',
        } as any;
        const mockNonAccentElement = { schemaName: 'paragraph' } as any;

        expect(isAccentElement(mockAccentElement)).toBe(true);
        expect(isAccentMainElement(mockMainElement)).toBe(true);
        expect(isAccentSectionElement(mockSectionElement)).toBe(true);

        expect(isAccentElement(mockNonAccentElement)).toBe(false);
        expect(isAccentMainElement(mockNonAccentElement)).toBe(false);
        expect(isAccentSectionElement(mockNonAccentElement)).toBe(false);
    });
});
