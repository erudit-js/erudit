import { existsSync } from 'node:fs';
import { imageSizeFromFile } from 'image-size/fromFile';
import type { GenericStorage, ParsedElement } from '@erudit-js/prose';
import {
    type ImageSchema,
    type ImageStorage,
} from '@erudit-js/prose/elements/image/image.global';

export async function createImageStorage(
    element: ParsedElement<ImageSchema>,
    storage: GenericStorage,
) {
    const imageFilePath = element.data.src;

    if (!existsSync(imageFilePath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `<Image> file not found: ${imageFilePath}`,
        });
    }

    let width, height: number;
    try {
        ({ width, height } = await imageSizeFromFile(imageFilePath));
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to get <Image> size for file: ${imageFilePath}`,
        });
    }

    storage[element.storageKey!] = {
        resolvedSrc:
            ERUDIT.config.public.project.baseUrl +
            'content/file/' +
            imageFilePath.replace(
                ERUDIT.config.paths.project + '/content/',
                '',
            ),
        width,
        height,
    } satisfies ImageStorage;
}
