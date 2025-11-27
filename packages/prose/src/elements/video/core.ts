import {
    defineRegistryItem,
    defineSchema,
    ensureTagChild,
    isRawElement,
} from '@jsprose/core';

import type { Invert } from '../../shared/core/invert.js';
import { captionSchema } from '../caption/core.js';
import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';
import { defineResolveStep } from '../../resolveStep.js';

export interface VideoData {
    src: string;
    autoplay?: boolean;
    invert?: Invert;
    width?: string;
}

export interface VideoStorage {
    resolvedSrc: string;
}

export const videoSchema = defineSchema({
    name: 'video',
    type: 'block',
    linkable: true,
})<{
    Data: VideoData;
    Storage: VideoStorage;
    Children: [typeof captionSchema] | undefined;
}>();

export const Video = defineEruditTag({
    tagName: 'Video',
    schema: videoSchema,
})<{
    src: string;
    autoplay?: boolean;
    invert?: Invert;
    width?: string;
    children?: {};
}>(({ element, tagName, props, children }) => {
    if (children) {
        ensureTagChild(tagName, children, captionSchema);
        element.children = children;
    }

    element.data = {
        src: props.src,
    };

    element.storageKey = props.src;

    if (props.autoplay !== undefined) {
        element.data.autoplay = props.autoplay;
    }

    if (props.width) {
        element.data.width = props.width;
    }

    if (props.invert) {
        element.data.invert = props.invert;
    }
});

export const videoRegistryItem = defineRegistryItem({
    schema: videoSchema,
    tags: [Video],
});

export default defineEruditProseCoreElement({
    registryItem: videoRegistryItem,
});

//
// Resolve
//

export const videoSrcStep = defineResolveStep(({ rawElement }) => {
    if (isRawElement(rawElement, videoSchema)) {
        return rawElement.data.src;
    }
});
