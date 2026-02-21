import { describe, expect, it } from 'vitest';
import { isRawElement } from 'tsprose';

import {
  type AccentSchema,
  defineAccentCore,
  isAccentElement,
  isAccentMainElement,
  isAccentSectionElement,
} from '@src/elements/accent/core';
import { asEruditRaw } from '@src/rawElement';
import { P } from '@src/elements/paragraph/core';

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

  it('should constuct final object infering accent and section names in runtime', () => {
    expect(fooAccent._sectionNames).toEqual(['bar']);

    expect(fooAccent.accent.schema.name).toBe('accent_foo');
    expect(fooAccent.accent.tag.tagName).toBe('Foo');
    expect(fooAccent.main.schema.name).toBe('accentMain_foo');
    expect(fooAccent.section.schema.name).toBe('accentSection_foo');
    expect(fooAccent.section.tags[1].schema.name).toBe('accentSection_foo');

    expect(fooAccent.accent.tag.tagName).toBe('Foo');
    expect(fooAccent.main.tag.tagName).toBe('FooMain');
    expect(fooAccent.section.tags[0].tagName).toBe('FooSection');
    expect(fooAccent.section.tags[1].tagName).toBe('FooBar');

    expect(fooAccent.accent.coreElement.schema).toBe(fooAccent.accent.schema);
    expect(fooAccent.main.coreElement.schema).toBe(fooAccent.main.schema);
    expect(fooAccent.section.coreElement.schema).toBe(fooAccent.section.schema);
    expect(fooAccent.section.coreElement.schema).toBe(fooAccent.section.schema);
  });

  it('should be usable in JSX', () => {
    const fooRawElement = asEruditRaw<AccentSchema>(
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

    expect(isRawElement(fooRawElement, fooAccent.accent.schema)).toBe(true);
    expect(fooRawElement.title).toBe('Accent Title');

    expect(
      isRawElement(fooRawElement.children![0], fooAccent.main.schema),
    ).toBe(true);
    expect(
      isRawElement(fooRawElement.children![1], fooAccent.section.schema),
    ).toBe(true);
    expect(fooRawElement.children![1].data).toEqual({
      type: 'manual',
      title: 'Section Title',
    });
    expect(
      isRawElement(fooRawElement.children![2], fooAccent.section.schema),
    ).toBe(true);
    expect(fooRawElement.children![2].data).toEqual({
      type: 'named',
      name: 'bar',
    });
  });

  it('should autowrap non-accent children into accentMain', () => {
    const element = (
      <Foo title="Accent Title">
        <P>Invalid child</P>
      </Foo>
    );

    expect(element.children?.length).toBe(1);
    expect(element.children?.[0].schema.name).toBe('accentMain_foo');
    expect(element.children?.[0].children?.length).toBe(1);
    expect(element.children?.[0].children?.[0].schema.name).toBe('paragraph');
  });

  it('should throw when accent or section title is empty', () => {
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

  it('should throw if accent has section-only children', () => {
    expect(() => (
      <Foo title="Accent Title">
        <FooSection title="Section Title">
          <P>Some section content.</P>
        </FooSection>
      </Foo>
    )).toThrow();
  });

  it('should provide type guards for ProseElement accent types', () => {
    const mockAccentElement = { schema: { name: 'accent_foo' } } as any;
    const mockMainElement = { schema: { name: 'accentMain_foo' } } as any;
    const mockSectionElement = {
      schema: { name: 'accentSection_foo' },
    } as any;
    const mockNonAccentElement = { schema: { name: 'paragraph' } } as any;

    expect(isAccentElement(mockAccentElement)).toBe(true);
    expect(isAccentMainElement(mockMainElement)).toBe(true);
    expect(isAccentSectionElement(mockSectionElement)).toBe(true);

    expect(isAccentElement(mockNonAccentElement)).toBe(false);
    expect(isAccentMainElement(mockNonAccentElement)).toBe(false);
    expect(isAccentSectionElement(mockNonAccentElement)).toBe(false);
  });
});
