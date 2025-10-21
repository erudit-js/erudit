import { ensureHasChildren, type RawChildren } from '../../children';
import { isElement, type JsxElement } from '../../element';
import { ProseError } from '../../error';
import { defineGlobalElement } from '../../globalElement';
import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { Image, type ImageSchema } from '../image/image.global';

export const galleryName = 'gallery';

export type GallerySchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof galleryName;
    Linkable: true;
    Data: undefined;
    Storage: undefined;
    Children: ImageSchema[];
}>;

export const Gallery = defineTag('Gallery')<
    GallerySchema,
    { children: RawChildren }
>({
    type: ElementType.Block,
    name: galleryName,
    linkable: true,
    initElement({ tagName, element, children }) {
        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<ImageSchema>[];
    },
    childStep({ tagName, child }) {
        if (!isElement(child, Image)) {
            throw new ProseError(
                `${tagName} can only have <Image> elements as children.`,
            );
        }
    },
});

export default defineGlobalElement<GallerySchema>()({
    name: galleryName,
    tags: { Gallery },
});
