import { ensureHasOneChild, type RawSingleChild } from '../../children';
import type { ElementSchema } from '../../schema';
import type { InvertOption } from '../../shared';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import type { CaptionSchema } from '../caption/caption.global';
import { Caption } from '../caption/caption.global';
import { ProseError } from '../../error';
import { isElement } from '../../element';
import { defineGlobalElement } from '../../globalElement';

export const videoName = 'video';

export interface VideoData {
    src: string;
    autoplay?: boolean;
    invert?: InvertOption;
    width?: string;
}

export interface VideoStorage {
    resolvedSrc: string;
}

export type VideoSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof videoName;
    Linkable: true;
    Data: VideoData;
    Storage: VideoStorage;
    Children: [CaptionSchema] | undefined;
}>;

export const Video = defineTag('Video')<
    VideoSchema,
    {
        src: string;
        autoplay?: boolean;
        invert?: InvertOption;
        width?: string;
        children?: RawSingleChild;
    }
>({
    type: ElementType.Block,
    name: videoName,
    linkable: true,
    initElement({ tagName, element, props, children }) {
        element.data = {
            src: props.src,
        };

        element.storageKey = videoName + ': ' + element.data.src;

        if (props.autoplay) {
            element.data.autoplay = props.autoplay;
        }

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

export default defineGlobalElement<VideoSchema>()({
    name: videoName,
    tags: { Video },
});
