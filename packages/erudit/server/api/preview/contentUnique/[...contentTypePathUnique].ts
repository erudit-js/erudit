import { mixSchema, uniqueName2Id, type ProseElement } from '@jsprose/core';
import { headingSchema } from '@erudit-js/prose/elements/heading/core';
import { detailsSchema } from '@erudit-js/prose/elements/details/core';

export default defineEventHandler<Promise<PreviewContentUnique>>(
    async (event) => {
        // <typeOrPart>/<fullContentId>/<uniqueName>.json
        const strContentTypePathUnique =
            event.context.params!.contentTypePathUnique.slice(0, -5);
        const parts = strContentTypePathUnique.split('/');

        const strContentTypePath = parts.slice(0, -1).join('/');
        const uniqueName = parts.at(-1)!;

        const contentTypePath = parseContentTypePath(strContentTypePath);
        const fullId = contentTypePath.contentId;
        const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);
        const shortId = navNode.shortId;

        const contentTitle = await ERUDIT.repository.content.title(fullId);

        const unique = await ERUDIT.repository.content.unique(
            fullId,
            contentTypePath.type === 'topic'
                ? contentTypePath.topicPart
                : 'page',
            uniqueName,
        );

        const uniqueProse = await (async () => {
            if (unique.prose.schemaName === headingSchema.name) {
                return await ERUDIT.repository.content.uniqueHeading(
                    fullId,
                    contentTypePath.type === 'topic'
                        ? contentTypePath.topicPart
                        : 'page',
                    uniqueName,
                );
            } else if (unique.prose.schemaName === detailsSchema.name) {
                const mix: ProseElement<typeof mixSchema> = {
                    __JSPROSE_element: true,
                    schemaName: mixSchema.name,
                    children: unique.prose.children!,
                } as ProseElement<typeof mixSchema>;

                return mix;
            } else {
                return unique.prose;
            }
        })();

        const finalizedProse =
            await ERUDIT.repository.prose.finalize(uniqueProse);

        const link = (() => {
            if (contentTypePath.type === 'topic') {
                return PAGES.topic(
                    contentTypePath.topicPart,
                    shortId,
                    uniqueName2Id(uniqueName),
                );
            }

            return PAGES[contentTypePath.type](
                shortId,
                uniqueName2Id(uniqueName),
            );
        })();

        const previewContentUnique: PreviewContentUnique = {
            schemaName: unique.prose.schemaName,
            elementTitle: unique.title || undefined,
            fadeOverlay: unique.prose.schemaName === headingSchema.name,
            contentTitle,
            link,
            ...finalizedProse,
        };

        return previewContentUnique;
    },
);
