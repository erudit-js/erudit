import { describe, expect, it } from 'vitest';

import { H1, H2, H3, type HeadingSchema } from '@src/elements/heading/core';
import { asEruditRaw } from '@src/rawElement';

describe('Heading', () => {
  it('should correclty set level, title, and automatic snippet/toc element data', () => {
    const h1WithoutSnippet = asEruditRaw<HeadingSchema>(
      <H1>Heading Level 1</H1>,
    );

    const h1 = asEruditRaw<HeadingSchema>(
      <H1 snippet={{ search: true }}>Heading Level 1</H1>,
    );
    const h2 = asEruditRaw<HeadingSchema>(
      <H2 snippet={{ key: true }}>Heading Level 2</H2>,
    );
    const h3 = asEruditRaw<HeadingSchema>(
      <H3
        snippet={{
          seo: {
            title: 'Custom Title',
            description: 'Custom Description',
          },
        }}
      >
        Heading Level 3
      </H3>,
    );

    expect(h1WithoutSnippet.snippet).toBeUndefined();

    expect(h1.data).toEqual({
      level: 1,
      title: 'Heading Level 1',
    });
    expect(h1.slug).toBe('Heading Level 1');
    expect(h1.snippet).toEqual({
      title: 'Heading Level 1',
      search: true,
      seo: true,
    });
    expect(h1.title).toBe('Heading Level 1');
    expect(h1.toc).toBe('Heading Level 1');

    expect(h2.data).toEqual({
      level: 2,
      title: 'Heading Level 2',
    });
    expect(h2.slug).toBe('Heading Level 2');
    expect(h2.title).toBe('Heading Level 2');
    expect(h2.toc).toBe('Heading Level 2');
    expect(h2.snippet).toEqual({
      key: true,
      seo: true,
      title: 'Heading Level 2',
    });

    expect(h3.data).toEqual({
      level: 3,
      title: 'Heading Level 3',
    });
    expect(h3.slug).toBe('Heading Level 3');
    expect(h3.title).toBe('Heading Level 3');
    expect(h3.toc).toBe('Heading Level 3');
    expect(h3.snippet).toEqual({
      title: 'Heading Level 3',
      seo: {
        title: 'Custom Title',
        description: 'Custom Description',
      },
    });

    const h3SeoString = asEruditRaw<HeadingSchema>(
      <H3
        snippet={{
          key: true,
          seo: 'Где используют уравнения в жизни?',
          description: `Подборка проблем и ситуаций из реальной жизни, которые можно решить, если перевести их в уравнения.`,
        }}
      >
        Another Heading 3
      </H3>,
    );

    expect(h3SeoString.snippet).toEqual({
      title: 'Another Heading 3',
      key: true,
      seo: 'Где используют уравнения в жизни?',
      description: `Подборка проблем и ситуаций из реальной жизни, которые можно решить, если перевести их в уравнения.`,
    });
  });

  it('should prioritize prop snippet data over auto-generated one', () => {
    expect(
      asEruditRaw<HeadingSchema>(
        <H1
          snippet={{
            title: 'Manual Snippet Title',
            description: 'Test description',
            search: true,
          }}
        >
          Auto-generated {'Snippet'} Title
        </H1>,
      ).snippet,
    ).toEqual({
      title: 'Manual Snippet Title',
      description: 'Test description',
      search: true,
      seo: true,
    });

    expect(
      asEruditRaw<HeadingSchema>(<H2 snippet={{ search: false }}>Heading 2</H2>)
        .snippet,
    ).toBeUndefined();
  });

  it('should throw if title is empty or falsy', () => {
    expect(() => {
      <H2> </H2>;
    }).toThrow();
  });
});
