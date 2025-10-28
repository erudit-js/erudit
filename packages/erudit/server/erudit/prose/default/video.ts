import { existsSync } from 'node:fs';
import type { ParsedElement, GenericStorage } from '@erudit-js/prose';
import type {
    VideoSchema,
    VideoStorage,
} from '@erudit-js/prose/elements/video/video.global';

export async function createVideoStorage(
    element: ParsedElement<VideoSchema>,
    storage: GenericStorage,
) {
    const videoFilePath = element.data.src;

    if (!existsSync(videoFilePath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `<Video> file not found: ${videoFilePath}`,
        });
    }

    storage[element.storageKey!] = {
        resolvedSrc:
            'content/file/' +
            videoFilePath.replace(
                ERUDIT.config.paths.project + '/content/',
                '',
            ),
    } satisfies VideoStorage;
}
