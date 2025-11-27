import type { AnySchema, RawElement } from '@jsprose/core';
import { resolveEruditRawElement } from '@erudit-js/prose';

export async function resolveEruditProse(
    rawElement: RawElement<AnySchema>,
    linkable: boolean,
) {
    return await resolveEruditRawElement({
        context: {
            language: ERUDIT.config.public.project.language.current,
            linkable,
        },
        rawElement,
    });
}
