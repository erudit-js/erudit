import { imageSizeFromFile } from 'image-size/fromFile';
import { ProseError } from '@jsprose/core';

import type { ImageStorage } from './core.js';
import { projectRelFilePath } from '../../shared/filePath.js';

export async function getImageSize(
    imageAbsoluteSrc: string,
): Promise<{ width: number; height: number }> {
    try {
        const size = await imageSizeFromFile(imageAbsoluteSrc);
        return { width: size.width, height: size.height };
    } catch (error) {
        throw new ProseError(
            `Failed to get image size for ${imageAbsoluteSrc}: ${error}`,
        );
    }
}

export async function createImageStorage(
    projectAbsPath: string,
    imageAbsoluteSrc: string,
): Promise<ImageStorage> {
    const size = await getImageSize(imageAbsoluteSrc);
    const resolvedSrc =
        'file/' + projectRelFilePath(projectAbsPath, imageAbsoluteSrc);

    return {
        resolvedSrc,
        width: size.width,
        height: size.height,
    };
}
