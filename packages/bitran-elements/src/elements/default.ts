import {
    defineBitranElement,
    type BitranElements,
} from '@erudit-js/cog/schema';

import { aliasesName, type AliasesSchema } from './aliases/shared';
import { includeName, type IncludeSchema } from './include/shared';
import { headingName, type HeadingSchema } from './heading/shared';
import { detailsName, type DetailsSchema } from './details/shared';
import { linkName, type LinkSchema } from './link/shared';

export function eruditDefaultElements(): BitranElements {
    return {
        [aliasesName]: defineBitranElement<AliasesSchema>({
            async transpiler() {
                const { aliasesTranspiler } = await import(
                    './aliases/transpiler'
                );
                return aliasesTranspiler;
            },
            async renderer() {
                const { aliasesRenderer } = await import('./aliases/renderer');
                return aliasesRenderer;
            },
        }),
        [includeName]: defineBitranElement<IncludeSchema>({
            async transpiler() {
                const { includeTranspiler } = await import(
                    './include/transpiler'
                );
                return includeTranspiler;
            },
            async renderer() {
                const { includeRenderer } = await import('./include/renderer');
                return includeRenderer;
            },
        }),
        [headingName]: defineBitranElement<HeadingSchema>({
            async transpiler() {
                const { headingTranspiler } = await import(
                    './heading/transpiler'
                );
                return headingTranspiler;
            },
            async renderer() {
                const { headingRenderer } = await import('./heading/renderer');
                return headingRenderer;
            },
        }),
        [detailsName]: defineBitranElement<DetailsSchema>({
            async transpiler() {
                const { detailsTranspiler } = await import(
                    './details/transpiler'
                );
                return detailsTranspiler;
            },
            async renderer() {
                const { detailsRenderer } = await import('./details/renderer');
                return detailsRenderer;
            },
        }),
        [linkName]: defineBitranElement<LinkSchema>({
            async transpiler() {
                const { linkTranspiler } = await import('./link/transpiler');
                return linkTranspiler;
            },
            async renderer() {
                const { linkRenderer } = await import('./link/renderer');
                return linkRenderer;
            },
        }),
    };
}
