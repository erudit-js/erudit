import { describe, expect, it } from 'vitest';

import {
  finalizeSnippet,
  normalizeSnippet,
  toSearchSnippet,
  toKeySnippet,
  toSeoSnippet,
  type Snippet,
  type SnippetRaw,
  type SnippetRawElementProp,
} from '@src/snippet';
import type { EruditRawElement } from '@src/rawElement';
import { defineSchema, type Schema } from 'tsprose';
import { defineEruditTag } from '@src/tag';
import { eruditRawToProse } from '@src/rawToProse';
import { P } from '@src/elements/paragraph/core';

function mockRawElement(
  overrides: SnippetRawElementProp & { title?: string } = {},
): EruditRawElement {
  return { ...overrides } as any;
}

function makeSnippet(overrides: Partial<Snippet> = {}): Snippet {
  return { title: 'Default Title', ...overrides };
}

describe('normalizeSnippet', () => {
  it('should use snippet title when present', () => {
    const result = normalizeSnippet({ title: 'My Title' });
    expect(result.title).toBe('My Title');
  });

  it('should trim snippet title', () => {
    const result = normalizeSnippet({ title: '   Padded   ' });
    expect(result.title).toBe('Padded');
  });

  it('should fall back to first non-empty fallback title', () => {
    const result = normalizeSnippet({}, undefined, '  Fallback  ');
    expect(result.title).toBe('Fallback');
  });

  it('should skip empty fallback titles', () => {
    const result = normalizeSnippet({}, '', '   ', 'Valid');
    expect(result.title).toBe('Valid');
  });

  it('should throw when no title and no fallbacks', () => {
    expect(() => normalizeSnippet({})).toThrow();
  });

  it('should throw when title is empty and fallbacks are empty', () => {
    expect(() => normalizeSnippet({ title: '   ' }, '', '  ')).toThrow();
  });

  it('should trim description', () => {
    const result = normalizeSnippet({
      title: 'T',
      description: '  Desc  ',
    });
    expect(result.description).toBe('Desc');
  });

  it('should set description to undefined when empty', () => {
    const result = normalizeSnippet({ title: 'T', description: '' });
    expect(result.description).toBeUndefined();
  });

  it('should set description to undefined when whitespace-only', () => {
    const result = normalizeSnippet({ title: 'T', description: '   ' });
    expect(result.description).toBeUndefined();
  });

  it('should preserve other fields in output', () => {
    const result = normalizeSnippet({
      title: 'T',
      search: true,
      key: 'K',
      seo: { title: 'S' },
    });
    expect(result.search).toBe(true);
    expect(result.key).toBe('K');
    expect(result.seo).toEqual({ title: 'S' });
  });
});

describe('finalizeSnippet', () => {
  describe('when tag prop snippet is provided', () => {
    it('should set snippet from tag prop', () => {
      const el = mockRawElement();
      finalizeSnippet(el, { title: 'Tag Title', search: true });
      expect(el.snippet).toEqual(
        expect.objectContaining({ title: 'Tag Title' }),
      );
    });

    it('should prune snippet when no active features', () => {
      const el = mockRawElement();
      finalizeSnippet(el, { title: 'Tag Title' });
      expect(el.snippet).toBeUndefined();
    });

    it('should use element title as fallback for tag prop snippet title', () => {
      const el = mockRawElement({ title: 'Element Title' });
      finalizeSnippet(el, { search: true });
      expect(el.snippet).toEqual(
        expect.objectContaining({ title: 'Element Title' }),
      );
    });

    it('should use internal snippet title as fallback before element title', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal Title' },
        title: 'Element Title',
      });
      finalizeSnippet(el, { search: true });
      expect(el.snippet).toEqual(
        expect.objectContaining({ title: 'Internal Title' }),
      );
    });

    it('should throw when tag prop snippet has no title and no fallbacks', () => {
      const el = mockRawElement();
      expect(() => finalizeSnippet(el, { search: true })).toThrow();
    });
  });

  describe('merging with internal snippet', () => {
    it('should merge internal description when tag prop has none', () => {
      const el = mockRawElement({
        snippet: {
          title: 'Internal',
          description: 'Internal Desc',
          search: true,
        },
      });
      finalizeSnippet(el, { title: 'Tag Title' });
      expect(el.snippet!.description).toBe('Internal Desc');
    });

    it('should prefer tag prop description over internal', () => {
      const el = mockRawElement({
        snippet: {
          title: 'Internal',
          description: 'Internal Desc',
          search: true,
        },
      });
      finalizeSnippet(el, {
        title: 'Tag Title',
        description: 'Tag Desc',
      });
      expect(el.snippet!.description).toBe('Tag Desc');
    });

    it('should merge internal search when tag prop has none', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', search: true },
      });
      finalizeSnippet(el, { title: 'Tag Title' });
      expect(el.snippet!.search).toBe(true);
    });

    it('should prefer tag prop search over internal', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', search: true },
      });
      finalizeSnippet(el, { title: 'Tag Title', search: 'Custom' });
      expect(el.snippet!.search).toBe('Custom');
    });

    it('should merge internal key when tag prop has none', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', key: true },
      });
      finalizeSnippet(el, { title: 'Tag Title' });
      expect(el.snippet!.key).toBe(true);
    });

    it('should prefer tag prop key over internal', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', key: true },
      });
      finalizeSnippet(el, { title: 'Tag Title', key: 'Override' });
      expect(el.snippet!.key).toBe('Override');
    });

    it('should merge internal seo when tag prop has none', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', seo: true },
      });
      finalizeSnippet(el, { title: 'Tag Title' });
      expect(el.snippet!.seo).toBe(true);
    });

    it('should prefer tag prop seo over internal', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', seo: true },
      });
      finalizeSnippet(el, {
        title: 'Tag Title',
        seo: { title: 'Custom SEO' },
      });
      expect(el.snippet!.seo).toEqual({ title: 'Custom SEO' });
    });

    it('should auto-enable seo when search is present', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', search: true },
      });
      finalizeSnippet(el, { title: 'Tag Title' });
      expect(el.snippet!.seo).toBe(true);
    });

    it('should auto-enable seo when key is present', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', key: true },
      });
      finalizeSnippet(el, { title: 'Tag Title' });
      expect(el.snippet!.seo).toBe(true);
    });

    it('should auto-enable seo when tag prop search is present', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal' },
      });
      finalizeSnippet(el, { title: 'Tag Title', search: true });
      expect(el.snippet!.seo).toBe(true);
    });

    it('should not auto-enable seo when seo is explicitly false', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', search: true },
      });
      finalizeSnippet(el, { title: 'Tag Title', seo: false });
      expect(el.snippet!.seo).toBe(false);
    });

    it('should not merge internal search when tag prop search is false', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', search: true },
      });
      finalizeSnippet(el, { title: 'Tag Title', search: false, key: true });
      expect(el.snippet!.search).toBe(false);
    });

    it('should not merge internal key when tag prop key is false', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', key: true },
      });
      finalizeSnippet(el, { title: 'Tag Title', key: false, search: true });
      expect(el.snippet!.key).toBe(false);
    });

    it('should not merge internal seo when tag prop seo is false', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', seo: true },
      });
      finalizeSnippet(el, { title: 'Tag Title', seo: false, search: true });
      expect(el.snippet!.seo).toBe(false);
    });

    it('should merge all fields from internal as fallback', () => {
      const el = mockRawElement({
        snippet: {
          title: 'Internal',
          description: 'Desc',
          search: ['syn1', 'syn2'],
          key: { title: 'Key T', description: 'Key D' },
          seo: { title: 'SEO T' },
        },
      });
      finalizeSnippet(el, { title: 'Tag Title' });
      expect(el.snippet).toEqual(
        expect.objectContaining({
          title: 'Tag Title',
          description: 'Desc',
          search: ['syn1', 'syn2'],
          key: { title: 'Key T', description: 'Key D' },
          // seo auto-enabled because search and key are present
          seo: true,
        }),
      );
    });
  });

  describe('when tag prop snippet is not provided', () => {
    it('should delete internal snippet from element', () => {
      const el = mockRawElement({
        snippet: { title: 'Internal', search: true },
      });
      finalizeSnippet(el, undefined);
      expect(el.snippet).toBeUndefined();
    });

    it('should leave element unchanged when no snippet at all', () => {
      const el = mockRawElement();
      finalizeSnippet(el, undefined);
      expect(el.snippet).toBeUndefined();
    });
  });
});

describe('toSearchSnippet', () => {
  it('should return undefined for undefined snippet', () => {
    expect(toSearchSnippet(undefined)).toBeUndefined();
  });

  it('should return undefined when search is falsy', () => {
    expect(toSearchSnippet(makeSnippet())).toBeUndefined();
  });

  it('should return undefined when search is false', () => {
    expect(toSearchSnippet(makeSnippet({ search: false }))).toBeUndefined();
  });

  describe('search: true', () => {
    it('should return snippet title and description', () => {
      const result = toSearchSnippet(
        makeSnippet({ description: 'Desc', search: true }),
      );
      expect(result).toEqual({
        title: 'Default Title',
        description: 'Desc',
      });
    });

    it('should return undefined description when snippet has none', () => {
      const result = toSearchSnippet(makeSnippet({ search: true }));
      expect(result).toEqual({
        title: 'Default Title',
        description: undefined,
      });
    });
  });

  describe('search: string', () => {
    it('should use string as title', () => {
      const result = toSearchSnippet(makeSnippet({ search: 'Custom' }));
      expect(result!.title).toBe('Custom');
    });

    it('should trim string title', () => {
      const result = toSearchSnippet(makeSnippet({ search: '  Trimmed  ' }));
      expect(result!.title).toBe('Trimmed');
    });

    it('should fall back to snippet title when string is empty', () => {
      const result = toSearchSnippet(makeSnippet({ search: '   ' }));
      expect(result!.title).toBe('Default Title');
    });

    it('should include snippet description', () => {
      const result = toSearchSnippet(
        makeSnippet({ search: 'S', description: 'D' }),
      );
      expect(result!.description).toBe('D');
    });
  });

  describe('search: string[]', () => {
    it('should use snippet title with synonyms', () => {
      const result = toSearchSnippet(makeSnippet({ search: ['alt1', 'alt2'] }));
      expect(result).toEqual({
        title: 'Default Title',
        description: undefined,
        synonyms: ['alt1', 'alt2'],
      });
    });

    it('should trim synonyms and filter empty', () => {
      const result = toSearchSnippet(
        makeSnippet({ search: ['  good  ', '', '   ', 'ok'] }),
      );
      expect(result!.synonyms).toEqual(['good', 'ok']);
    });

    it('should set synonyms to undefined when all empty', () => {
      const result = toSearchSnippet(makeSnippet({ search: ['', '   '] }));
      expect(result!.synonyms).toBeUndefined();
    });
  });

  describe('search: object', () => {
    it('should use object title and description', () => {
      const result = toSearchSnippet(
        makeSnippet({
          search: { title: 'ObjTitle', description: 'ObjDesc' },
        }),
      );
      expect(result).toEqual({
        title: 'ObjTitle',
        description: 'ObjDesc',
        synonyms: undefined,
      });
    });

    it('should fall back to snippet title when object title is empty', () => {
      const result = toSearchSnippet(makeSnippet({ search: { title: '   ' } }));
      expect(result!.title).toBe('Default Title');
    });

    it('should fall back to snippet description when object description is empty', () => {
      const result = toSearchSnippet(
        makeSnippet({
          description: 'Snippet Desc',
          search: { description: '   ' },
        }),
      );
      expect(result!.description).toBe('Snippet Desc');
    });

    it('should include synonyms', () => {
      const result = toSearchSnippet(
        makeSnippet({
          search: { title: 'T', synonyms: ['a', 'b'] },
        }),
      );
      expect(result!.synonyms).toEqual(['a', 'b']);
    });

    it('should trim and filter synonyms', () => {
      const result = toSearchSnippet(
        makeSnippet({
          search: { title: 'T', synonyms: ['  x  ', '', '  y  '] },
        }),
      );
      expect(result!.synonyms).toEqual(['x', 'y']);
    });

    it('should set synonyms to undefined when all empty', () => {
      const result = toSearchSnippet(
        makeSnippet({ search: { title: 'T', synonyms: ['', '  '] } }),
      );
      expect(result!.synonyms).toBeUndefined();
    });

    it('should set synonyms to undefined when not provided', () => {
      const result = toSearchSnippet(makeSnippet({ search: { title: 'T' } }));
      expect(result!.synonyms).toBeUndefined();
    });
  });
});

describe('toKeySnippet', () => {
  it('should return undefined for undefined snippet', () => {
    expect(toKeySnippet(undefined)).toBeUndefined();
  });

  it('should return undefined when key is falsy', () => {
    expect(toKeySnippet(makeSnippet())).toBeUndefined();
  });

  it('should return undefined when key is false', () => {
    expect(toKeySnippet(makeSnippet({ key: false }))).toBeUndefined();
  });

  describe('key: true', () => {
    it('should return snippet title and description', () => {
      const result = toKeySnippet(makeSnippet({ description: 'D', key: true }));
      expect(result).toEqual({ title: 'Default Title', description: 'D' });
    });

    it('should return undefined description when snippet has none', () => {
      const result = toKeySnippet(makeSnippet({ key: true }));
      expect(result).toEqual({
        title: 'Default Title',
        description: undefined,
      });
    });
  });

  describe('key: string', () => {
    it('should use string as title', () => {
      const result = toKeySnippet(makeSnippet({ key: 'Custom Key' }));
      expect(result!.title).toBe('Custom Key');
    });

    it('should trim string title', () => {
      const result = toKeySnippet(makeSnippet({ key: '  Trimmed  ' }));
      expect(result!.title).toBe('Trimmed');
    });

    it('should fall back to snippet title when string is empty', () => {
      const result = toKeySnippet(makeSnippet({ key: '   ' }));
      expect(result!.title).toBe('Default Title');
    });

    it('should include snippet description', () => {
      const result = toKeySnippet(makeSnippet({ key: 'K', description: 'D' }));
      expect(result!.description).toBe('D');
    });
  });

  describe('key: object', () => {
    it('should use object title and description', () => {
      const result = toKeySnippet(
        makeSnippet({ key: { title: 'KT', description: 'KD' } }),
      );
      expect(result).toEqual({ title: 'KT', description: 'KD' });
    });

    it('should fall back to snippet title when object title is empty', () => {
      const result = toKeySnippet(makeSnippet({ key: { title: '   ' } }));
      expect(result!.title).toBe('Default Title');
    });

    it('should fall back to snippet description when object description is empty', () => {
      const result = toKeySnippet(
        makeSnippet({
          description: 'Snippet D',
          key: { description: '   ' },
        }),
      );
      expect(result!.description).toBe('Snippet D');
    });
  });
});

//
// toSeoSnippet
//

describe('toSeoSnippet', () => {
  it('should return undefined for undefined snippet', () => {
    expect(toSeoSnippet(undefined)).toBeUndefined();
  });

  it('should return undefined when seo is falsy', () => {
    expect(toSeoSnippet(makeSnippet())).toBeUndefined();
  });

  it('should return undefined when seo is false', () => {
    expect(toSeoSnippet(makeSnippet({ seo: false }))).toBeUndefined();
  });

  describe('seo: true', () => {
    it('should return snippet title and description', () => {
      const result = toSeoSnippet(makeSnippet({ description: 'D', seo: true }));
      expect(result).toEqual({ title: 'Default Title', description: 'D' });
    });

    it('should return undefined description when snippet has none', () => {
      const result = toSeoSnippet(makeSnippet({ seo: true }));
      expect(result).toEqual({
        title: 'Default Title',
        description: undefined,
      });
    });
  });

  describe('seo: string', () => {
    it('should use string as title', () => {
      const result = toSeoSnippet(makeSnippet({ seo: 'SEO Title' }));
      expect(result!.title).toBe('SEO Title');
    });

    it('should trim string title', () => {
      const result = toSeoSnippet(makeSnippet({ seo: '  Trimmed  ' }));
      expect(result!.title).toBe('Trimmed');
    });

    it('should fall back to snippet title when string is empty', () => {
      const result = toSeoSnippet(makeSnippet({ seo: '   ' }));
      expect(result!.title).toBe('Default Title');
    });

    it('should include snippet description', () => {
      const result = toSeoSnippet(makeSnippet({ seo: 'S', description: 'D' }));
      expect(result!.description).toBe('D');
    });
  });

  describe('seo: object', () => {
    it('should use object title and description', () => {
      const result = toSeoSnippet(
        makeSnippet({ seo: { title: 'ST', description: 'SD' } }),
      );
      expect(result).toEqual({ title: 'ST', description: 'SD' });
    });

    it('should fall back to snippet title when object title is empty', () => {
      const result = toSeoSnippet(makeSnippet({ seo: { title: '   ' } }));
      expect(result!.title).toBe('Default Title');
    });

    it('should fall back to snippet description when object description is empty', () => {
      const result = toSeoSnippet(
        makeSnippet({
          description: 'Snippet D',
          seo: { description: '   ' },
        }),
      );
      expect(result!.description).toBe('Snippet D');
    });
  });
});

describe('snippetHook', () => {
  interface SnippetTestSchema extends Schema {
    name: 'snippetTest';
    type: 'block';
    linkable: true;
    Data: undefined;
    Storage: undefined;
    Children: undefined;
  }

  const snippetTestSchema = defineSchema<SnippetTestSchema>({
    name: 'snippetTest',
    type: 'block',
    linkable: true,
  });

  const SnippetTest = defineEruditTag({
    schema: snippetTestSchema,
    tagName: 'SnippetTest',
  })<{ label: string; internalSnippet?: SnippetRaw }>(({ element, props }) => {
    element.title = props.label;
    if (props.internalSnippet) {
      element.snippet = props.internalSnippet;
    }
  });

  it('should collect snippets from elements with snippet prop', async () => {
    const result = await eruditRawToProse(
      { snippets: { enabled: true } },
      <>
        <SnippetTest
          label="First"
          snippet={{ title: 'First Snippet', search: true }}
        />
        <SnippetTest label="No Snippet" />
        <SnippetTest
          label="Second"
          snippet={{ title: 'Second Snippet', key: true }}
        />
      </>,
    );

    expect(result.snippets).toHaveLength(2);
    expect(result.snippets[0]).toEqual({
      schemaName: 'snippetTest',
      elementId: expect.any(String),
      snippet: expect.objectContaining({ title: 'First Snippet' }),
    });
    expect(result.snippets[1]).toEqual({
      schemaName: 'snippetTest',
      elementId: expect.any(String),
      snippet: expect.objectContaining({ title: 'Second Snippet' }),
    });
  });

  it('should not collect snippets when disabled', async () => {
    const result = await eruditRawToProse(
      { snippets: { enabled: false } },
      <SnippetTest
        label="Ignored"
        snippet={{ title: 'Ignored Snippet', search: true }}
      />,
    );

    expect(result.snippets).toHaveLength(0);
  });

  it('should not collect snippets when context has no snippets config', async () => {
    const result = await eruditRawToProse(
      {},
      <SnippetTest
        label="Ignored"
        snippet={{ title: 'Ignored Snippet', search: true }}
      />,
    );

    expect(result.snippets).toHaveLength(0);
  });

  it('should use element title as snippet title fallback', async () => {
    const result = await eruditRawToProse(
      { snippets: { enabled: true } },
      <SnippetTest label="Element Label" snippet={{ search: true }} />,
    );

    expect(result.snippets).toHaveLength(1);
    expect(result.snippets[0].snippet.title).toBe('Element Label');
  });

  it('should delete internal snippet when no tag prop snippet provided', async () => {
    const result = await eruditRawToProse(
      { snippets: { enabled: true } },
      <SnippetTest
        label="Has Internal"
        internalSnippet={{ title: 'Internal Only', search: true }}
      />,
    );

    // Internal snippet without tag prop snippet should be deleted
    expect(result.snippets).toHaveLength(0);
  });

  it('should merge internal snippet data with tag prop snippet', async () => {
    const result = await eruditRawToProse(
      { snippets: { enabled: true } },
      <SnippetTest
        label="Merged"
        internalSnippet={{
          title: 'Internal Title',
          description: 'Internal Desc',
          search: true,
          key: 'Internal Key',
        }}
        snippet={{ title: 'Tag Title' }}
      />,
    );

    expect(result.snippets).toHaveLength(1);
    const snippet = result.snippets[0].snippet;
    expect(snippet.title).toBe('Tag Title');
    expect(snippet.description).toBe('Internal Desc');
    expect(snippet.search).toBe(true);
    expect(snippet.key).toBe('Internal Key');
    // Auto-enabled because search and key are present
    expect(snippet.seo).toBe(true);
  });

  it('should prefer tag prop fields over internal when both present', async () => {
    const result = await eruditRawToProse(
      { snippets: { enabled: true } },
      <SnippetTest
        label="Both"
        internalSnippet={{
          title: 'Internal Title',
          description: 'Internal Desc',
          search: true,
        }}
        snippet={{
          title: 'Tag Title',
          description: 'Tag Desc',
          search: 'Custom Search',
        }}
      />,
    );

    expect(result.snippets).toHaveLength(1);
    const snippet = result.snippets[0].snippet;
    expect(snippet.title).toBe('Tag Title');
    expect(snippet.description).toBe('Tag Desc');
    expect(snippet.search).toBe('Custom Search');
  });

  it('should work alongside other elements like P', async () => {
    const result = await eruditRawToProse(
      { snippets: { enabled: true } },
      <>
        <P snippet={{ title: 'Paragraph Snippet', search: true }}>Some text</P>
        <SnippetTest
          label="Custom"
          snippet={{ title: 'Custom Snippet', key: true }}
        />
      </>,
    );

    expect(result.snippets).toHaveLength(2);
    expect(result.snippets[0].schemaName).toBe('paragraph');
    expect(result.snippets[0].snippet.title).toBe('Paragraph Snippet');
    expect(result.snippets[1].schemaName).toBe('snippetTest');
    expect(result.snippets[1].snippet.title).toBe('Custom Snippet');
  });
});
