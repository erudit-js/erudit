import {
    type ParsedElement,
    type ElementSchemaAny,
    type GenericStorage,
    fillStorage,
    isElement,
} from '@erudit-js/prose';
import { Video } from '@erudit-js/prose/elements/video/video.global';
import { Link } from '@erudit-js/prose/default/link/index';
import { BlockLink } from '@erudit-js/prose/default/blockLink/index';
import { Image } from '@erudit-js/prose/elements/image/image.global';

import globalElements from '#erudit/prose/global';
import type { ContentNavNode } from '../../content/nav/types';
import { createImageStorage } from '../default/image';
import { createLinkStorage } from '../default/link';
import { createVideoStorage } from '../default/video';

export async function resolveProse<TSchema extends ElementSchemaAny>(
    navNode: ContentNavNode,
    element: ParsedElement<TSchema>,
) {
    const storageGenerators = Object.fromEntries(
        Object.entries(globalElements).map(
            ([elementName, globalElementDefinition]) => [
                elementName,
                globalElementDefinition.createStorageData,
            ],
        ),
    );

    const storage: GenericStorage = {};

    await fillStorage({
        storage,
        storageGenerators,
        element,
        step: async (element) => {
            switch (true) {
                case isElement(element, Link):
                case isElement(element, BlockLink):
                    await createLinkStorage(element, storage);
                    break;
                case isElement(element, Image):
                    await createImageStorage(navNode, element, storage);
                    break;
                case isElement(element, Video):
                    await createVideoStorage(navNode, element, storage);
                    break;
            }
        },
    });

    return { element, storage };
}
