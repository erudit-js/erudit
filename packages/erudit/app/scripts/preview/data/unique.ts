import {
    encodeBitranLocation,
    parseBitranLocation,
} from '@erudit-js/cog/schema';

import type { RawBitranContent } from '@shared/bitran/content';

import { PreviewDataType, type PreviewDataBase } from '../data';
import type { PreviewFooter } from '../footer';
import { PreviewRequestType, type PreviewRequest } from '../request';

export interface PreviewDataUnique extends PreviewDataBase {
    type: PreviewDataType.Unique;
    elementName: string;
    title: string;
    rawBitranContent: RawBitranContent;
    footer: PreviewFooter;
}

export async function buildUnique(
    request: PreviewRequest,
): Promise<PreviewDataUnique | undefined> {
    if (request.type !== PreviewRequestType.Link) return;

    const { linkTarget } = request;

    if (linkTarget.type !== 'unique') return;

    const serverData = await $fetch(
        `/api/preview/unique/${encodeBitranLocation(linkTarget._absoluteStrLocation!)}`,
        { responseType: 'json' },
    );
    const elementName = serverData.elementName;
    const customTitle = serverData.title;

    const icon = await useBitranElementIcon(elementName);

    const productPhraseName = await (async () => {
        const elementPhrase = await useBitranElementLanguage(elementName);
        try {
            return elementPhrase('_element_title');
        } catch {
            return elementName;
        }
    })();

    let secondary = serverData.context
        .filter((i) => !i.hidden)
        .map((i) => i.title)
        .join(' / ');
    secondary += customTitle
        ? (secondary ? ' • ' : '') + productPhraseName
        : '';

    const primary = customTitle || productPhraseName || elementName;

    return {
        type: PreviewDataType.Unique,
        elementName: elementName,
        title: customTitle || productPhraseName,
        rawBitranContent: serverData.rawBitranContent as RawBitranContent,
        footer: {
            iconSvg: icon,
            primary,
            secondary,
            href: linkTarget._href,
        },
    };
}
