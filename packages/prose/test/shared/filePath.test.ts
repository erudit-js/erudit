import { describe, expect, it } from 'vitest';

import { projectRelFilePath } from '@src/shared/filePath';

describe('projectRelFilePath', () => {
  it('should return the relative file path when the file is within the project', () => {
    const projectAbsPath = '/users/test/project';
    const fileAbsPath = '/users/test/project/images/photo.jpg';
    const relativePath = projectRelFilePath(projectAbsPath, fileAbsPath);
    expect(relativePath).toBe('images/photo.jpg');
  });

  it('should trhow an error when the file is outside the project', () => {
    const projectAbsPath = '/users/test/project';
    const fileAbsPath = '/users/test/other/photo.jpg';
    expect(() => projectRelFilePath(projectAbsPath, fileAbsPath)).toThrow();
  });
});
