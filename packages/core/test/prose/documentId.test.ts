import { describe, expect, it } from 'vitest';

import {
  parseDocumentId,
  pathToDocumentId,
  stringifyDocumentId,
} from '@src/prose/documentId.js';

describe('stringify/parse document ID', () => {
  it('should throw for unknown document ID types', () => {
    expect(() => parseDocumentId('/some/unknown/id')).toThrow();
  });

  it('should handle content page document IDs', () => {
    expect(
      stringifyDocumentId({
        type: 'contentPage',
        contentId: 'chapter/section',
      }),
    ).toBe('contentPage/chapter/section');
    expect(parseDocumentId('contentPage/chapter/section')).toEqual({
      type: 'contentPage',
      contentId: 'chapter/section',
    });
  });

  it('should handle content topic document IDs', () => {
    expect(
      stringifyDocumentId({
        type: 'contentTopic',
        topicPart: 'article',
        contentId: 'chapter/section',
      }),
    ).toBe('contentTopic/article/chapter/section');
    expect(parseDocumentId('contentTopic/article/chapter/section')).toEqual({
      type: 'contentTopic',
      topicPart: 'article',
      contentId: 'chapter/section',
    });
  });
});

describe('pathToDocumentId', () => {
  it('should return undefined when the path does not match any document', () => {
    expect(
      pathToDocumentId('/some/other/path', '/project/path'),
    ).toBeUndefined();
  });

  it('should parse content page document IDs correctly', () => {
    const projectPath = '/project/path';
    const contentPagePath = `${projectPath}/content/1+chapter/2-section/page.tsx`;
    expect(pathToDocumentId(contentPagePath, projectPath)).toEqual({
      type: 'contentPage',
      contentId: 'chapter/section',
    });
  });

  it('should parse content topic document IDs correctly', () => {
    const projectPath = '/project/path';
    const contentArticlePath = `${projectPath}/content/1+chapter/2-section/article.tsx`;
    expect(pathToDocumentId(contentArticlePath, projectPath)).toEqual({
      type: 'contentTopic',
      topicPart: 'article',
      contentId: 'chapter/section',
    });
  });
});
