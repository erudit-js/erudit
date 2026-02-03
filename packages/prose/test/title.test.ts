import { describe, expect, it } from 'vitest';

import { finalizeTitle } from '@erudit-js/prose';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

const testFinalizeTitle = finalizeTitle as (
  args: DeepPartial<Parameters<typeof finalizeTitle>[0]>,
) => any;

describe('finalizeTitle', () => {
  it('should use element.title when available', () => {
    expect(
      testFinalizeTitle({
        element: { title: 'Element Title' },
        props: {
          snippet: { title: 'Snippet Title' },
          toc: 'TOC Title',
        },
      }),
    ).toBe('Element Title');
  });

  it('should fall back to props.snippet.title when element.title is empty', () => {
    expect(
      testFinalizeTitle({
        element: { title: '   ' },
        props: {
          snippet: { title: 'Snippet Title' },
          toc: 'TOC Title',
        },
      }),
    ).toBe('Snippet Title');
  });

  it('should fall back to props.toc when both element.title and snippet.title are empty', () => {
    expect(
      testFinalizeTitle({
        element: { title: '   ' },
        props: {
          snippet: { title: '   ' },
          toc: 'TOC Title',
        },
      }),
    ).toBe('TOC Title');
  });

  it('should return undefined when all title sources are empty', () => {
    expect(
      testFinalizeTitle({
        element: { title: '   ' },
        props: {
          snippet: { title: '   ' },
          toc: '   ',
        },
      }),
    ).toBeUndefined();
  });
});
