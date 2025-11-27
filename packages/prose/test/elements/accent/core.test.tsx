import { describe, expect, it } from 'vitest';
import { isolateProse, isRawElement, PROSE_REGISTRY } from '@jsprose/core';

import { asEruditRaw } from '@erudit-js/prose';
import {
    P,
    paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';
import { defineAccent } from '@erudit-js/prose/elements/accent/core';

describe('Accent', () => {
    it('should throw when invalid accent and section names are used', () => {
        expect(() =>
            defineAccent({
                name: 'Name',
                sectionNames: [],
            }),
        ).toThrow();

        expect(() =>
            defineAccent({
                name: 'accent',
                sectionNames: ['Foo'],
            }),
        ).toThrow();

        expect(() => {
            defineAccent({
                name: 'accent',
                sectionNames: ['section'], // Reserved
            });
        }).toThrow();

        expect(() => {
            defineAccent({
                name: 'accent',
                sectionNames: ['main'], // Reserved
            });
        }).toThrow();
    });

    const fooAccent = defineAccent({
        name: 'foo',
        sectionNames: ['bar'],
    });

    const Foo = fooAccent.accent.tag;
    const FooMain = fooAccent.main.tag;
    const FooSection = fooAccent.section.tag;
    const FooBar = fooAccent.bar.tag;

    const registryItems = [
        fooAccent.accent.registryItem,
        fooAccent.main.registryItem,
        fooAccent.section.registryItem,
        fooAccent.bar.registryItem,
    ] as const;

    it('should constuct final object infering accent and section names in runtime', () => {
        expect(fooAccent._sectionNames).toEqual(['bar']);

        expect(fooAccent.accent.schema.name).toBe('foo');
        expect(fooAccent.accent.tag.tagName).toBe('Foo');
        expect(fooAccent.main.schema.name).toBe('fooMain');
        expect(fooAccent.section.schema.name).toBe('fooSection');
        expect(fooAccent.bar.schema.name).toBe('fooBar');

        expect(fooAccent.accent.tag.tagName).toBe('Foo');
        expect(fooAccent.main.tag.tagName).toBe('FooMain');
        expect(fooAccent.section.tag.tagName).toBe('FooSection');
        expect(fooAccent.bar.tag.tagName).toBe('FooBar');

        expect(fooAccent.accent.registryItem.schema).toBe(
            fooAccent.accent.schema,
        );
        expect(fooAccent.main.registryItem.schema).toBe(fooAccent.main.schema);
        expect(fooAccent.section.registryItem.schema).toBe(
            fooAccent.section.schema,
        );
        expect(fooAccent.bar.registryItem.schema).toBe(fooAccent.bar.schema);
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
            expect(
                isRawElement(fooRawElement.children![2], fooAccent.bar.schema),
            ).toBe(true);
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
});
