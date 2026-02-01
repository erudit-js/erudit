import type { ProseElement, GenericStorage } from '@jsprose/core';
import type { calloutSchema } from '@erudit-js/prose/elements/callout/core';
import { createCalloutStorage as _createCalloutStorage } from '@erudit-js/prose/elements/callout/storage';

export async function createCalloutStorage(
    element: ProseElement<typeof calloutSchema>,
    storage: GenericStorage,
) {
    const runtimeConfig = useRuntimeConfig();

    storage[element.storageKey!] = _createCalloutStorage(
        ERUDIT.paths.project(),
        runtimeConfig.app.baseURL,
        element.data.iconSrc,
    );
}
