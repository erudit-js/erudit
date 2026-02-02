import { describe, expect, it } from 'vitest';

import { contentPathToId, parseContentPathPart } from '@src/content/path.js';

describe('parseContentPathPart', () => {
  it('should return undefined for invalid parts', () => {
    expect(parseContentPathPart('invalid-part')).toBeUndefined();
  });

  it('should parse valid parts correctly', () => {
    expect(parseContentPathPart('012-foo-bar')).toStrictEqual({
      position: 12,
      skip: false,
      partId: 'foo-bar',
    });

    expect(parseContentPathPart('3+baz')).toStrictEqual({
      position: 3,
      skip: true,
      partId: 'baz',
    });
  });
});

describe('contentPathToId', () => {
  it('should return undefined for paths not under content', () => {
    expect(
      contentPathToId('/some/other/path', '/project/path', 'full'),
    ).toBeUndefined();
  });

  it('should return undefined for content paths with no valid parts', () => {
    expect(
      contentPathToId(
        '/project/path/content/invalid-part/another-invalid',
        '/project/path',
        'full',
      ),
    ).toBeUndefined();
    expect(
      contentPathToId(
        '/project/path/content/invalid/01-foo/3+bar',
        '/project/path',
        'full',
      ),
    ).toBeUndefined();
  });

  it('should correctly build full content IDs', () => {
    const projectPath = '/project/path';
    const contentPath = `${projectPath}/content/001-intro/002+chapter/003-section/foo/bar.md`;
    expect(contentPathToId(contentPath, projectPath, 'full')).toBe(
      'intro/chapter/section',
    );
  });

  it('should correctly build short content IDs', () => {
    const projectPath = '/project/path';
    const contentPath = `${projectPath}/content/001-intro/002+chapter/003-section/foo/bar.md`;
    expect(contentPathToId(contentPath, projectPath, 'short')).toBe(
      'intro/section',
    );
  });

  it('should keep last part when building short content IDs', () => {
    const projectPath = '/project/path';
    const contentPath = `${projectPath}/content/001-intro/002-chapter/003+section/004+conclusion/foo/bar.md`;
    expect(contentPathToId(contentPath, projectPath, 'short')).toBe(
      'intro/chapter/conclusion',
    );
  });
});
