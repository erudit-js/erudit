import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { imageSizeFromFile } from 'image-size/fromFile';
import type { GenericStorage, ParsedElement } from '@erudit-js/prose';
import {
    type ImageSchema,
    type ImageStorage,
} from '@erudit-js/prose/elements/image/image.global';

import type { ContentNavNode } from '../../content/nav/types';

export async function createImageStorage(
    navNode: ContentNavNode,
    element: ParsedElement<ImageSchema>,
    storage: GenericStorage,
) {
    const imageData = element.data;

    const baseFsPath =
        ERUDIT.config.paths.project + '/content/' + navNode.contentRelPath;

    const finalFsPath = resolve(baseFsPath, imageData.src).replace(/\\/g, '/');

    if (!existsSync(finalFsPath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `<Image> file not found: ${imageData.src}`,
        });
    }

    let width, height: number;
    try {
        ({ width, height } = await imageSizeFromFile(finalFsPath));
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to get <Image> size for file: ${imageData.src}`,
        });
    }

    storage[element.storageKey!] = {
        resolvedSrc:
            ERUDIT.config.public.project.baseUrl +
            'content/file/' +
            finalFsPath.replace(ERUDIT.config.paths.project + '/content/', ''),
        width,
        height,
    } satisfies ImageStorage;
}
