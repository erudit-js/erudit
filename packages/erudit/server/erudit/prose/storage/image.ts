import type { GenericStorage, ProseElement } from '@jsprose/core';
import type {
    imageSchema,
    ImageStorage,
} from '@erudit-js/prose/elements/image/core';
import { createImageStorage as _createImageStorage } from '@erudit-js/prose/elements/image/storage';

export async function createImageStorage(
    element: ProseElement<typeof imageSchema>,
    storage: GenericStorage,
) {
    const imageAbsPath = element.data.src;
    const imageStorage = await _createImageStorage(
        ERUDIT.config.paths.project,
        ERUDIT.config.public.project.baseUrl,
        imageAbsPath,
    );

    storage[element.storageKey!] = imageStorage satisfies ImageStorage;
}
