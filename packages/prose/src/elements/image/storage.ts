import { imageSizeFromFile } from 'image-size/fromFile';

import type { ImageStorage } from './core.js';
import { EruditProseError } from '../../error.js';

export async function getImageSize(
  imageAbsoluteSrc: string,
): Promise<{ width: number; height: number }> {
  try {
    const size = await imageSizeFromFile(imageAbsoluteSrc);
    return { width: size.width, height: size.height };
  } catch (error) {
    throw new EruditProseError(
      `Failed to get image size for ${imageAbsoluteSrc}: ${error}`,
    );
  }
}

export async function createImageStorage(
  projectAbsPath: string,
  projectBaseUrl: string,
  imageRelSrc: string,
): Promise<ImageStorage> {
  const imageAbsSrc = `${projectAbsPath}/${imageRelSrc}`;
  const size = await getImageSize(imageAbsSrc);
  const resolvedSrc = projectBaseUrl + 'file/' + imageRelSrc;

  return {
    resolvedSrc,
    width: size.width,
    height: size.height,
  };
}
