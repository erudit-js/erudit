import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { getImageSize } from '@erudit-js/prose/elements/image/storage';

describe('getImageSize', () => {
  const currentDir = dirname(fileURLToPath(import.meta.url));

  it('should retrieve image size correctly', async () => {
    const size = await getImageSize(currentDir + '/image.jpg');
    expect(size).toStrictEqual({ width: 736, height: 866 });
  });

  it('should throw error for non-image file', async () => {
    await expect(async () => {
      await getImageSize(currentDir + '/notAnImage.txt');
    }).rejects.toThrow();
  });
});
