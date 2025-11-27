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
import { photoswipeDependency } from '../../shared/core/photoswipe.js';

export interface ImageData {
    src: string;
    invert?: Invert;
    width?: string;
}

export interface ImageStorage {
    resolvedSrc: string;
    width: number;
    height: number;
}

export const imageSchema = defineSchema({
    name: 'image',
    type: 'block',
    linkable: true,
})<{
    Data: ImageData;
    Storage: ImageStorage;
    Children: [typeof captionSchema] | undefined;
}>();

export const Image = defineEruditTag({
    tagName: 'Image',
    schema: imageSchema,
})<{ src: string; invert?: Invert; width?: string; children?: {} }>(({
    element,
    tagName,
    props,
    children,
}) => {
    if (children) {
        ensureTagChild(tagName, children, captionSchema);
        element.children = children;
    }

    element.data = {
        src: props.src,
    };

    element.storageKey = props.src;

    if (props.width) {
        element.data.width = props.width;
    }

    if (props.invert) {
        element.data.invert = props.invert;
    }
});

export const imageRegistryItem = defineRegistryItem({
    schema: imageSchema,
    tags: [Image],
});

export default defineEruditProseCoreElement({
    registryItem: imageRegistryItem,
    dependencies: {
        ...photoswipeDependency,
    },
});

//
// Resolve
//

export const imageSrcStep = defineResolveStep(({ rawElement }) => {
    if (isRawElement(rawElement, imageSchema)) {
        return rawElement.data.src;
    }
});
