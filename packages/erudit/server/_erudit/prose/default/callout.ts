import { existsSync } from 'node:fs';
import type { CalloutSchema } from '@erudit-js/prose/elements/callout/callout.global';
import type { GenericStorage, ParsedElement } from '@erudit-js/prose';

export async function createCalloutStorage(
    element: ParsedElement<CalloutSchema>,
    storage: GenericStorage,
) {
    const calloutIconFilePath = element.data.iconSrc;

    if (!existsSync(calloutIconFilePath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `<Callout> icon file not found: ${calloutIconFilePath}`,
        });
    }

    storage[element.storageKey!] = {
        resolvedSrc:
            ERUDIT.config.public.project.baseUrl +
            'content/file/' +
            calloutIconFilePath.replace(
                ERUDIT.config.paths.project + '/content/',
                '',
            ),
    };
}
