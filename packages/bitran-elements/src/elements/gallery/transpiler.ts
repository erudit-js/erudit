import { defineElementTranspiler } from '@bitran-js/transpiler';

import { GalleryNode, type GallerySchema } from './shared';
import { GalleryParser, GalleryStringifier } from './factory';

export const galleryTranspiler = defineElementTranspiler<GallerySchema>({
    Node: GalleryNode,
    Parsers: [GalleryParser],
    Stringifier: GalleryStringifier,
});
