import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import type { ParsedElement, GenericStorage } from '@erudit-js/prose';
import type {
    VideoSchema,
    VideoStorage,
} from '@erudit-js/prose/elements/video/video.global';

import type { ContentNavNode } from '../../content/nav/types';

export async function createVideoStorage(
    navNode: ContentNavNode,
    element: ParsedElement<VideoSchema>,
    storage: GenericStorage,
) {
    const videoData = element.data;

    const baseFsPath =
        ERUDIT.config.paths.project + '/content/' + navNode.contentRelPath;

    const finalFsPath = resolve(baseFsPath, videoData.src).replace(/\\/g, '/');

    if (!existsSync(finalFsPath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `<Video> file not found: ${videoData.src}`,
        });
    }

    storage[element.storageKey!] = {
        resolvedSrc:
            'content/file/' +
            finalFsPath.replace(ERUDIT.config.paths.project + '/content/', ''),
    } satisfies VideoStorage;
}
