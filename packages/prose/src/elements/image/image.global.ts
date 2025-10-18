import { ensureHasOneChild, type RawSingleChild } from '../../children';
import { isElement } from '../../element';
import { ProseError } from '../../error';
import { defineGlobalElement } from '../../globalElement';
import type { ElementSchema } from '../../schema';
import type { InvertOption } from '../../shared';
import { photoswipeDependency } from '../../shared/photoswipe/dependency';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { Caption, type CaptionSchema } from '../caption/caption.global';

export const imageName = 'image';

export interface ImageData {
    src: string;
    invert?: InvertOption;
    width?: string;
}

export interface ImageStorage {
    resolvedSrc: string;
    width: number;
    height: number;
}

export type ImageSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof imageName;
    Linkable: true;
    Data: ImageData;
    Storage: ImageStorage;
    Children: [CaptionSchema] | undefined;
}>;

export const Image = defineTag('Image')<
    ImageSchema,
    {
        invert?: InvertOption;
        width?: string;
        src: string;
        children?: RawSingleChild;
    }
>({
    type: ElementType.Block,
    name: imageName,
    linkable: true,
    initElement({ tagName, element, props, children }) {
        element.data = {
            src: props.src,
        };

        element.storageKey = imageName + ': ' + element.data.src;

        if (props.invert) {
            element.data.invert = props.invert;
        }

        if (props.width) {
            element.data.width = props.width;
        }

        if (children) {
            ensureHasOneChild(tagName, children);

            const child = children[0];

            if (!isElement(child, Caption)) {
                throw new ProseError(
                    `<${tagName}> only child must be a <Caption> element.`,
                );
            }

            element.children = [child];
        }
    },
});

export default defineGlobalElement<ImageSchema>()({
    name: imageName,
    tags: { Image },
    dependencies: {
        ...photoswipeDependency,
    },
});
