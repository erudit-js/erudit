import { getHeadingUniqueData } from '@erudit/server/prose/default/heading';
import { headingName } from '@erudit-js/prose/default/heading/index';
import type { PreviewContentUnique } from '#layers/erudit/shared/types/preview';

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

        const { element, storage } = await ERUDIT.repository.prose.resolve(
            uniqueData.element,
        );

        const toReturn: PreviewContentUnique = {
            href: uniqueData.href,
            documentTitle: uniqueData.documentTitle,
            element,
            storage,
        };

        if (uniqueData.element.name === headingName) {
            const { element: extraElement, storage: extraStorage } =
                await getHeadingUniqueData(contentPath, uniqueSlug);

            Object.assign(storage, extraStorage);

            toReturn.headingStack = extraElement;
        }

        return toReturn;
    },
);
