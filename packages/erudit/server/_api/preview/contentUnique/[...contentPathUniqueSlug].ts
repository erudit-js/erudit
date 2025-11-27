// import { getHeadingUniqueData } from '@erudit/server/prose/default/heading';
// import { headingName } from '@erudit-js/prose/default/heading/index';
// import type { PreviewContentUnique } from '#layers/erudit/shared/types/preview';
// import { detailsName } from '@erudit-js/prose/default/details/index';
// import {
//     blocksName,
//     type BlocksSchema,
// } from '@erudit-js/prose/default/blocks/index';
// import { ElementType, type ParsedElement } from '@erudit-js/prose';

export default defineEventHandler<Promise<PreviewContentUnique>>(
    async (event) => {
        // <typeOrPart>/<fullContentId>/<uniqueSlug>.json
        const contentPathUniqueSlug =
            event.context.params!.contentPathUniqueSlug.slice(0, -5);

        const parts = contentPathUniqueSlug!.split('/');

        const contentPath = parts.slice(0, -1).join('/');
        const uniqueSlug = parts.slice(-1)[0];

        const { fullOrShortId: fullId, typeOrPart } =
            parseContentPath(contentPath);

        const uniqueData = await ERUDIT.repository.prose.unique(
            fullId,
            typeOrPart,
            uniqueSlug,
        );

        const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);

        const { element, storage } = await ERUDIT.repository.prose.resolve(
            uniqueData.element,
        );

        const uniqueContent: PreviewContentUnique = {
            href: uniqueData.href,
            documentTitle: uniqueData.documentTitle,
            element,
            storage,
        };

        // if (uniqueData.element.name === headingName) {
        //     const { element: extraElement, storage: renderStorage } =
        //         await getHeadingUniqueData(navNode, contentPath, uniqueSlug);

        //     uniqueContent.storage = renderStorage;
        //     uniqueContent.fadeOverlay = true;
        //     uniqueContent.toRenderElement = extraElement;
        // } else if (uniqueData.element.name === detailsName) {
        //     const blocks: ParsedElement<BlocksSchema> = {
        //         type: ElementType.Block,
        //         name: blocksName,
        //         // @ts-expect-error
        //         children: uniqueData.element.children,
        //     };

        //     uniqueContent.toRenderElement = blocks;
        // }

        // return uniqueContent;

        return { a: 42 } as any;
    },
);
