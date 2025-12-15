import {
    fillStorage,
    isProseElement,
    PROSE_REGISTRY,
    type AnySchema,
    type GenericStorage,
    type ProseElement,
} from '@jsprose/core';
import { imageSchema } from '@erudit-js/prose/elements/image/core';
import { videoSchema } from '@erudit-js/prose/elements/video/core';
import { calloutSchema } from '@erudit-js/prose/elements/callout/core';
import {
    blockLinkSchema,
    linkSchema,
} from '@erudit-js/prose/elements/link/core';

import { createImageStorage } from '../storage/image';
import { createVideoStorage } from '../storage/video';
import { createCalloutStorage } from '../storage/callout';
import { createLinkStorage } from '../storage/link';

export async function finalizeProse(
    proseElement: ProseElement<AnySchema>,
): Promise<FinalizedProse> {
    const storage: GenericStorage = {};

    await fillStorage({
        storage,
        proseElement,
        storageCreators: PROSE_REGISTRY.getStorageCreators(),
        step: async (element) => {
            switch (true) {
                case isProseElement(element, imageSchema):
                    await createImageStorage(element, storage);
                    break;
                case isProseElement(element, videoSchema):
                    await createVideoStorage(element, storage);
                    break;
                case isProseElement(element, calloutSchema):
                    await createCalloutStorage(element, storage);
                    break;
                case isProseElement(element, linkSchema):
                case isProseElement(element, blockLinkSchema):
                    await createLinkStorage(element, storage);
                    break;
            }
        },
    });

    return {
        proseElement,
        storage,
    };
}
