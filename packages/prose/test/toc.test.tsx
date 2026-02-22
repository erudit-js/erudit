import { describe, expect, it } from 'vitest';

import { finalizeToc, type TocRawElementProp } from '@src/toc';
import type { EruditRawElement } from '@src/rawElement';
import { defineSchema, type Schema } from 'tsprose';
import { defineEruditTag } from '@src/tag';
import { eruditRawToProse } from '@src/rawToProse';
import { H1, H2 } from '@src/elements/heading/core';
import { P } from '@src/elements/paragraph/core';

function mockRawElement(
  overrides: TocRawElementProp & {
    title?: string;
    snippet?: { title: string };
  } = {},
): EruditRawElement {
  return { ...overrides } as any;
}

describe('finalizeToc', () => {
  it('should set toc to false when propToc is false', () => {
    const el = mockRawElement({ toc: 'Title' });
    finalizeToc(el, false);
    expect(el.toc).toBe(false);
  });

  it('should set toc true flag to false when propToc is false', () => {
    const el = mockRawElement({ toc: true });
    finalizeToc(el, false);
    expect(el.toc).toBe(false);
  });

  it('should set toc to trimmed propToc string', () => {
    const el = mockRawElement();
    finalizeToc(el, '   Custom Title   ');
    expect(el.toc).toBe('Custom Title');
  });

  it('should override internal toc string with propToc string', () => {
    const el = mockRawElement({ toc: 'Internal' });
    finalizeToc(el, '   Override   ');
    expect(el.toc).toBe('Override');
  });

  it('should throw when propToc is an empty string', () => {
    const el = mockRawElement();
    expect(() => finalizeToc(el, '')).toThrow();
  });

  it('should throw when propToc is a whitespace-only string', () => {
    const el = mockRawElement();
    expect(() => finalizeToc(el, '   ')).toThrow();
  });

  it('should resolve toc true flag using element title', () => {
    const el = mockRawElement({ toc: true, title: '   Element Title   ' });
    finalizeToc(el, undefined);
    expect(el.toc).toBe('Element Title');
  });

  it('should throw when toc is true but title is missing', () => {
    const el = mockRawElement({ toc: true });
    expect(() => finalizeToc(el, undefined)).toThrow();
  });

  it('should throw when toc is true but title is empty', () => {
    const el = mockRawElement({ toc: true, title: '   ' });
    expect(() => finalizeToc(el, undefined)).toThrow();
  });

  it('should fall back to snippet title when toc is true and element title is missing', () => {
    const el = mockRawElement({
      toc: true,
      snippet: { title: 'Snippet Title' },
    });
    finalizeToc(el, undefined);
    expect(el.toc).toBe('Snippet Title');
  });

  it('should prefer element title over snippet title when toc is true', () => {
    const el = mockRawElement({
      toc: true,
      title: 'Element Title',
      snippet: { title: 'Snippet Title' },
    });
    finalizeToc(el, undefined);
    expect(el.toc).toBe('Element Title');
  });

  it('should throw when toc is true and both element title and snippet title are missing', () => {
    const el = mockRawElement({ toc: true });
    expect(() => finalizeToc(el, undefined)).toThrow();
  });

  it('should use internal toc string when propToc is true', () => {
    const el = mockRawElement({ toc: '   Internal Title   ' });
    finalizeToc(el, true);
    expect(el.toc).toBe('Internal Title');
  });

  it('should fall back to element title when propToc is true and no toc string', () => {
    const el = mockRawElement({ title: '   Fallback Title   ' });
    finalizeToc(el, true);
    expect(el.toc).toBe('Fallback Title');
  });

  it('should prefer internal toc string over title when propToc is true', () => {
    const el = mockRawElement({
      toc: '   TOC String   ',
      title: '   Title   ',
    });
    finalizeToc(el, true);
    expect(el.toc).toBe('TOC String');
  });

  it('should throw when propToc is true but no toc string or title', () => {
    const el = mockRawElement();
    expect(() => finalizeToc(el, true)).toThrow();
  });

  it('should fall back to snippet title when propToc is true and toc string and element title are missing', () => {
    const el = mockRawElement({ snippet: { title: 'Snippet Title' } });
    finalizeToc(el, true);
    expect(el.toc).toBe('Snippet Title');
  });

  it('should prefer element title over snippet title when propToc is true', () => {
    const el = mockRawElement({
      title: 'Element Title',
      snippet: { title: 'Snippet Title' },
    });
    finalizeToc(el, true);
    expect(el.toc).toBe('Element Title');
  });

  it('should prefer toc string over snippet title when propToc is true', () => {
    const el = mockRawElement({
      toc: 'TOC String',
      snippet: { title: 'Snippet Title' },
    });
    finalizeToc(el, true);
    expect(el.toc).toBe('TOC String');
  });

  it('should throw when propToc is true and toc string, element title, and snippet title are all missing', () => {
    const el = mockRawElement();
    expect(() => finalizeToc(el, true)).toThrow();
  });

  it('should keep valid internal toc string as-is', () => {
    const el = mockRawElement({ toc: '   Valid  ' });
    finalizeToc(el, undefined);
    expect(el.toc).toBe('Valid');
  });

  it('should throw when internal toc string is empty', () => {
    const el = mockRawElement({ toc: '' });
    expect(() => finalizeToc(el, undefined)).toThrow();
  });

  it('should throw when internal toc string is whitespace-only', () => {
    const el = mockRawElement({ toc: '   ' });
    expect(() => finalizeToc(el, undefined)).toThrow();
  });

  it('should leave element unchanged when no toc is involved', () => {
    const el = mockRawElement();
    finalizeToc(el, undefined);
    expect(el.toc).toBeUndefined();
  });
});

describe('tocHook', () => {
  interface AutoTocSchema extends Schema {
    name: 'autoToc';
    type: 'block';
    linkable: true;
    Data: undefined;
    Storage: undefined;
    Children: undefined;
  }

  const autoTocSchema = defineSchema<AutoTocSchema>({
    name: 'autoToc',
    type: 'block',
    linkable: true,
  });

  const AutoToc = defineEruditTag({
    schema: autoTocSchema,
    tagName: 'AutoToc',
  })<{ label: string }>(({ element, props }) => {
    element.title = props.label;
  });

  it('should build toc tree with correct hierarchy', async () => {
    const rawToProseResult = await eruditRawToProse({
      toc: {
        enabled: true,
        addSchemas: [autoTocSchema],
      },
      rawProse: (
        <>
          <AutoToc label="The First!" />
          <H1>Article Heading</H1>
          <AutoToc label="The Skipped!" toc={false} />
          <P toc="Important Paragraph">Some text</P>
          <AutoToc label="The Second!" />
          <H2>Sub Heading</H2>
          <AutoToc label="The Third!" />
          <H1>Another Big Section</H1>
          <AutoToc label="The Fourth!" />
        </>
      ),
    });

    const toc = rawToProseResult.toc;

    expect(toc).toEqual([
      {
        type: 'element',
        schemaName: 'autoToc',
        title: 'The First!',
        elementId: expect.any(String),
      },
      {
        type: 'heading',
        level: 1,
        title: 'Article Heading',
        elementId: expect.any(String),
        children: [
          {
            type: 'element',
            schemaName: 'paragraph',
            title: 'Important Paragraph',
            elementId: expect.any(String),
          },
          {
            type: 'element',
            schemaName: 'autoToc',
            title: 'The Second!',
            elementId: expect.any(String),
          },
          {
            type: 'heading',
            level: 2,
            title: 'Sub Heading',
            elementId: expect.any(String),
            children: [
              {
                type: 'element',
                schemaName: 'autoToc',
                title: 'The Third!',
                elementId: expect.any(String),
              },
            ],
          },
        ],
      },
      {
        type: 'heading',
        level: 1,
        title: 'Another Big Section',
        elementId: expect.any(String),
        children: [
          {
            type: 'element',
            schemaName: 'autoToc',
            title: 'The Fourth!',
            elementId: expect.any(String),
          },
        ],
      },
    ]);
  });
});
