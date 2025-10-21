import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { CalloutSchema } from '@erudit-js/prose/elements/callout/callout.global';
import type { GenericStorage, ParsedElement } from '@erudit-js/prose';

import type { ContentNavNode } from '../../content/nav/types';

export async function createCalloutStorage(
    navNode: ContentNavNode,
    element: ParsedElement<CalloutSchema>,
    storage: GenericStorage,
) {
    const calloutData = element.data;

    const baseFsPath =
        ERUDIT.config.paths.project + '/content/' + navNode.contentRelPath;

    const finalFsPath = resolve(baseFsPath, calloutData.iconSrc).replace(
        /\\/g,
        '/',
    );

    if (!existsSync(finalFsPath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `<Callout> icon file not found: ${calloutData.iconSrc}`,
        });
    }

    storage[element.storageKey!] = {
        resolvedSrc:
            ERUDIT.config.public.project.baseUrl +
            'content/file/' +
            finalFsPath.replace(ERUDIT.config.paths.project + '/content/', ''),
    };
}
