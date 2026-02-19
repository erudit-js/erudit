import { describe, expect, it } from 'vitest';
import { defineSchema, type Schema } from 'tsprose';

import { Include, isIncludedRawElement } from '@src/include';
import type { EruditRawElement } from '@src/rawElement';
import { defineEruditTag } from '@src/tag';
import { eruditRawToProse } from '@src/rawToProse';
import { H1 } from '@src/elements/heading/core';
import { P } from '@src/elements/paragraph/core';

interface TestSchema extends Schema {
  name: 'includeTest';
  type: 'block';
  linkable: true;
  Data: undefined;
  Storage: undefined;
  Children: undefined;
}

const testSchema = defineSchema<TestSchema>({
  name: 'includeTest',
  type: 'block',
  linkable: true,
});

const Test = defineEruditTag({
  schema: testSchema,
  tagName: 'IncludeTest',
})<{ label: string }>(({ element, props }) => {
  element.title = props.label;
});

describe('isIncludedRawElement', () => {
  it('should return false for plain element', () => {
    expect(isIncludedRawElement({} as any)).toBe(false);
  });

  it('should return true after Include processes element', () => {
    const el = {} as EruditRawElement;
    Include({ children: el as any });
    expect(isIncludedRawElement(el as any)).toBe(true);
  });
});

describe('<Include /> integration', () => {
  it('should strip toc from included elements by default', async () => {
    const result = await eruditRawToProse(
      { toc: { enabled: true, addSchemas: [testSchema] } },
      <>
        <H1>Real Heading</H1>
        <Include>
          <Test label="Included" toc="Should Be Stripped" />
        </Include>
      </>,
    );

    expect(result.toc).toEqual([
      expect.objectContaining({ type: 'heading', title: 'Real Heading' }),
    ]);
  });

  it('should keep toc when Include has toc prop', async () => {
    const result = await eruditRawToProse(
      { toc: { enabled: true, addSchemas: [testSchema] } },
      <>
        <H1>Heading</H1>
        <Include toc="Custom TOC">
          <Test label="Included" />
        </Include>
      </>,
    );

    const heading = result.toc.find(
      (e) => e.type === 'heading' && e.title === 'Heading',
    )!;
    expect(heading.type === 'heading' && heading.children).toEqual([
      expect.objectContaining({ type: 'element', title: 'Custom TOC' }),
    ]);
  });

  it('should strip snippets from included elements', async () => {
    const result = await eruditRawToProse(
      { snippets: { enabled: true } },
      <>
        <P snippet={{ title: 'Normal', search: true }}>Normal</P>
        <Include>
          <Test
            label="Included"
            snippet={{ title: 'Included Snippet', search: true }}
          />
        </Include>
      </>,
    );

    expect(result.snippets).toHaveLength(1);
    expect(result.snippets[0].snippet.title).toBe('Normal');
  });
});
