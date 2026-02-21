import { describe, expect, it } from 'vitest';

import {
  stringifyDocumentId,
  type DocumentId,
} from '@erudit-js/core/prose/documentId';
import { asEruditRaw } from '@src/rawElement';
import { Ref, type RefSchema } from '@src/elements/link/reference/core';
import { defineDocument, isProseElement } from 'tsprose';
import { P } from '@src/elements/paragraph/core';
import { Dep, Dependency, depSchema } from '@src/elements/link/dependency/core';
import { eruditRawToProse } from '@src/rawToProse';

describe('Reference Links', () => {
  it('should return unknown storage key when unable to resolve "to" prop', () => {
    const link = asEruditRaw<RefSchema>(
      <Ref to={123 as any}>Invalid Link</Ref>,
    );
    expect(link.storageKey).toMatch(/^<link:unknown>\//);
  });

  it('should throw when label is empty', () => {
    expect(() => <Ref to="direct"> </Ref>).toThrow();
  });

  it('should create stringified storage key', () => {
    const link = asEruditRaw(<Ref to="https://example.com">Example</Ref>);
    expect(link.storageKey).toBe('<link:external>/https://example.com');
  });
});

describe('Dependency Links', () => {
  it('should collect dependencies', async () => {
    const otherDocumentLink: DocumentId = {
      type: 'contentTopic',
      topicPart: 'article',
      contentId: 'topic-111/article-222',
    };

    const otherDocument = defineDocument(
      stringifyDocumentId(otherDocumentLink),
      {
        uniques: {
          externalP: P,
        },
      },
    )(({ uniques }) => (
      <>
        <P>Other Document Paragraph</P>
        <P $={uniques.externalP}>External Unique Paragraph</P>
      </>
    ));

    const thisDocumentLink: DocumentId = {
      type: 'contentPage',
      contentId: 'topic-456/page-789',
    };

    const thisDocument = defineDocument(stringifyDocumentId(thisDocumentLink), {
      uniques: {
        internalP: P,
      },
    })(({ uniques }) => (
      <>
        <P>Regular Paragraph</P>

        <Dependency on={otherDocument.uniques.externalP}>
          Dependency to External Unique
        </Dependency>

        <Dep on={uniques.internalP}>Dependency to Self Unique</Dep>

        <Dep on={uniques.internalP}>Dependency to internal paragraph</Dep>
        <P $={uniques.internalP}>Internal Paragraph</P>
      </>
    ));

    const { contentLinks } = await eruditRawToProse({
      rawProse: thisDocument.rawProse,
    });

    // Extract dependency storage keys from the Map
    const dependencies = Array.from(contentLinks.entries())
      .filter(([_, entries]) =>
        entries.some((e) => e.type === 'Dep' || e.type === 'Dependency'),
      )
      .map(([key]) => key);

    expect(dependencies.length).toBe(2);
    expect(dependencies).toEqual(
      expect.arrayContaining([
        // Link to unique
        '<link:global>/topic-456/page-789/$internalP',

        // Link to external unique
        '<link:global>/topic-111/article-222/article/$externalP',
      ]),
    );

    // Check labels are collected (full, not trimmed)
    const internalLinks = contentLinks.get(
      '<link:global>/topic-456/page-789/$internalP',
    )!;
    expect(internalLinks).toHaveLength(2); // Two <Dep> elements
    expect(internalLinks[0].label).toBe('Dependency to Self Unique');
    expect(internalLinks[1].label).toBe('Dependency to internal paragraph');

    const externalLinks = contentLinks.get(
      '<link:global>/topic-111/article-222/article/$externalP',
    )!;
    expect(externalLinks).toHaveLength(1);
    expect(externalLinks[0].label).toBe('Dependency to External Unique');

    // Check type differentiation
    expect(internalLinks[0].type).toBe('Dep');
    expect(externalLinks[0].type).toBe('Dependency');
  });

  it('should execute dependencyStep resolve step', async () => {
    const thisDocumentLink: DocumentId = {
      type: 'contentPage',
      contentId: 'topic-555/page-666',
    };

    const thisDocument = defineDocument(stringifyDocumentId(thisDocumentLink), {
      uniques: {
        internalP: P,
      },
    })(({ uniques }) => (
      <>
        <P>Regular Paragraph</P>
        <P>
          This is a <Dep on={uniques.internalP}>dependency</Dep>!
        </P>
        <P $={uniques.internalP}>Internal Paragraph</P>
      </>
    ));

    const { prose, contentLinks } = await eruditRawToProse({
      rawProse: thisDocument.rawProse,
    });

    const depElement = prose.children!.at(1)?.children!.at(1)!;
    expect(isProseElement(depElement, depSchema)).toBe(true);
    expect(depElement.storageKey).toBe(
      '<link:global>/topic-555/page-666/$internalP',
    );

    // Extract dependency storage keys from the Map
    const dependencies = Array.from(contentLinks.entries())
      .filter(([_, entries]) =>
        entries.some((e) => e.type === 'Dep' || e.type === 'Dependency'),
      )
      .map(([key]) => key);

    expect(dependencies.length).toBe(1);
    expect(dependencies).toEqual([
      '<link:global>/topic-555/page-666/$internalP',
    ]);

    // Check label is collected (full, not trimmed)
    const links = contentLinks.get(
      '<link:global>/topic-555/page-666/$internalP',
    )!;
    expect(links).toHaveLength(1);
    expect(links[0].label).toBe('dependency');
    expect(links[0].type).toBe('Dep');
  });
});
