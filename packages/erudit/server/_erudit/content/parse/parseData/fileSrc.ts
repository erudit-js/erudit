import {
    type ParsedElement,
    type ElementSchemaAny,
    isElement,
} from '@erudit-js/prose';
import { Callout } from '@erudit-js/prose/elements/callout/callout.global';
import { Image } from '@erudit-js/prose/elements/image/image.global';
import { Video } from '@erudit-js/prose/elements/video/video.global';

export async function tryAddFileSrc(
    contentFullId: string,
    element: ParsedElement<ElementSchemaAny>,
) {
    let src = '';

    if (isElement(element, Image) || isElement(element, Video)) {
        src = element.data.src;
    } else if (isElement(element, Callout)) {
        src = element.data.iconSrc;
    }

    if (src) {
        await ERUDIT.db
            .insert(ERUDIT.db.schema.contentParseData)
            .values({
                fullId: contentFullId,
                type: 'fileSrc',
                value: src,
            })
            .onConflictDoNothing();
    }
}
