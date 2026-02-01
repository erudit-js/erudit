import type { AnySchema, RawElement } from '@jsprose/core';
import { resolveEruditRawElement, type ResolveStep } from '@erudit-js/prose';

export async function resolveEruditProse(
    rawElement: RawElement<AnySchema>,
    linkable: boolean,
    step?: ResolveStep,
) {
    return await resolveEruditRawElement({
        context: {
            language: ERUDIT.config.public.language.current,
            linkable,
        },
        rawElement,
        step,
    });
}
