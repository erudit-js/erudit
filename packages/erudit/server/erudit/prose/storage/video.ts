import type { GenericStorage, ProseElement } from '@jsprose/core';
import type { videoSchema } from '@erudit-js/prose/elements/video/core';
import { createVideoStorage as _createVideoStorage } from '@erudit-js/prose/elements/video/storage';

export async function createVideoStorage(
    element: ProseElement<typeof videoSchema>,
    storage: GenericStorage,
) {
    storage[element.storageKey!] = _createVideoStorage(
        ERUDIT.config.paths.project,
        ERUDIT.config.public.project.baseUrl,
        element.data.src,
    );
}
