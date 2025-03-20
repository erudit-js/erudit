import {
    encodeBitranLocation,
    type BitranContext,
} from '@erudit-js/cog/schema';

import { PreviewDataType, type PreviewDataBase } from '../data';
import type { PreviewFooter } from '../footer';
import { PreviewRequestType, type PreviewRequest } from '../request';
import type { StringBitranContent } from '@erudit/shared/bitran/stringContent';

export interface PreviewDataUnique extends PreviewDataBase {
    type: PreviewDataType.Unique;
    productName: string;
    bitran: {
        context: BitranContext;
        content: StringBitranContent;
    };
    footer: PreviewFooter;
}

export async function buildUnique(
    request: PreviewRequest,
): Promise<PreviewDataUnique> {
    if (request.type !== PreviewRequestType.Link) return;

    const { linkTarget } = request;

    if (linkTarget.type !== 'unique') return;

    const serverData = (await $fetch(
        `/api/preview/unique/${encodeBitranLocation(linkTarget._absoluteStrLocation!)}`,
        { responseType: 'json' },
    )) as any;
    const productName = serverData.bitran.productName;
    const customTitle = serverData.productTitle;

    const icon = await useBitranElementIcon(productName);

    const productPhraseName = await (async () => {
        const elementPhrase = await useBitranElementLanguage(productName);
        try {
            return elementPhrase('_element_title');
        } catch {
            return productName;
        }
    })();

    let secondary = serverData.context
        .filter((i) => !i.hidden)
        .map((i) => i.title)
        .join(' / ');
    secondary += customTitle
        ? (secondary ? ' • ' : '') + productPhraseName
        : '';

    const primary = customTitle || productPhraseName || productName;

    return {
        type: PreviewDataType.Unique,
        productName,
        bitran: {
            context: serverData.bitran.context,
            content: serverData.bitran.content as any,
        },
        footer: {
            iconSvg: icon,
            primary,
            secondary,
            href: linkTarget._href,
        },
    };
}
