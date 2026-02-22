import { describe, expect, it } from 'vitest';

import { projectRelFilePath } from '@src/shared/filePath';

describe('projectRelFilePath', () => {
  describe('POSIX paths', () => {
    it('should return the relative file path when the file is within the project', () => {
      expect(
        projectRelFilePath(
          '/users/test/project',
          '/users/test/project/images/photo.jpg',
        ),
      ).toBe('images/photo.jpg');
    });

    it('should return a single-segment relative path', () => {
      expect(
        projectRelFilePath(
          '/users/test/project',
          '/users/test/project/photo.jpg',
        ),
      ).toBe('photo.jpg');
    });

    it('should throw when the file is outside the project', () => {
      expect(() =>
        projectRelFilePath(
          '/users/test/project',
          '/users/test/other/photo.jpg',
        ),
      ).toThrow();
    });

    it('should throw when the file path is the project root itself', () => {
      expect(() =>
        projectRelFilePath('/users/test/project', '/users/test/project'),
      ).toThrow();
    });

    it('should throw when the file path only shares a prefix but not a directory boundary', () => {
      // /users/test/project-other should NOT be treated as inside /users/test/project
      expect(() =>
        projectRelFilePath(
          '/users/test/project',
          '/users/test/project-other/photo.jpg',
        ),
      ).toThrow();
    });
  });

  describe('Windows absolute paths (drive letter)', () => {
    it('should return the relative path for a Windows-style path', () => {
      expect(
        projectRelFilePath(
          'C:/users/test/project',
          'C:/users/test/project/images/photo.jpg',
        ),
      ).toBe('images/photo.jpg');
    });

    it('should handle backslashes in both project and file paths', () => {
      expect(
        projectRelFilePath(
          'C:\\users\\test\\project',
          'C:\\users\\test\\project\\images\\photo.jpg',
        ),
      ).toBe('images/photo.jpg');
    });

    it('should handle mixed slashes', () => {
      expect(
        projectRelFilePath(
          'C:\\users\\test\\project',
          'C:/users/test/project/video/clip.mp4',
        ),
      ).toBe('video/clip.mp4');
    });

    it('should be case-insensitive on the drive letter', () => {
      expect(
        projectRelFilePath(
          'C:/users/test/project',
          'c:/users/test/project/images/photo.jpg',
        ),
      ).toBe('images/photo.jpg');
      expect(
        projectRelFilePath(
          'c:/users/test/project',
          'C:/users/test/project/images/photo.jpg',
        ),
      ).toBe('images/photo.jpg');
    });

    it('should throw when the file is on the same drive but outside the project', () => {
      expect(() =>
        projectRelFilePath('C:/users/test/project', 'C:/users/other/photo.jpg'),
      ).toThrow();
    });

    it('should throw when the file is on a different drive', () => {
      expect(() =>
        projectRelFilePath(
          'C:/users/test/project',
          'D:/users/test/project/photo.jpg',
        ),
      ).toThrow();
    });

    it('should throw when path only shares a prefix but not a directory boundary', () => {
      expect(() =>
        projectRelFilePath('C:/project', 'C:/project-other/photo.jpg'),
      ).toThrow();
    });
  });

  describe('parent traversal', () => {
    it('should throw when the relative path contains ..', () => {
      expect(() =>
        projectRelFilePath(
          '/users/test/project',
          '/users/test/project/../other/photo.jpg',
        ),
      ).toThrow();
    });

    it('should throw for Windows paths with parent traversal', () => {
      expect(() =>
        projectRelFilePath('C:/project', 'C:/project/../other/photo.jpg'),
      ).toThrow();
    });
  });

  describe('relative file paths as input', () => {
    it('should handle a plain relative path', () => {
      expect(
        projectRelFilePath('/users/test/project', 'images/photo.jpg'),
      ).toBe('images/photo.jpg');
    });

    it('should strip a leading ./ from a relative path', () => {
      expect(
        projectRelFilePath('/users/test/project', './images/photo.jpg'),
      ).toBe('images/photo.jpg');
    });

    it('should throw when a relative path contains parent traversal', () => {
      expect(() =>
        projectRelFilePath('/users/test/project', '../other/photo.jpg'),
      ).toThrow();
    });
  });
});
