import type { ProseElement, GenericStorage } from '@jsprose/core';
import type { calloutSchema } from '@erudit-js/prose/elements/callout/core';
import { createCalloutStorage as _createCalloutStorage } from '@erudit-js/prose/elements/callout/storage';

export async function createCalloutStorage(
    element: ProseElement<typeof calloutSchema>,
    storage: GenericStorage,
) {
    storage[element.storageKey!] = _createCalloutStorage(
        ERUDIT.config.paths.project,
        ERUDIT.config.public.project.baseUrl,
        element.data.iconSrc,
    );
}
