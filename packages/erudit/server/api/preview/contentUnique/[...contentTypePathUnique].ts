import { headingSchema } from '@erudit-js/prose/elements/heading/core';
import { detailsSchema } from '@erudit-js/prose/elements/details/core';
import { isProseElement, makeProseElement, mixSchema } from 'tsprose';

export default defineEventHandler<Promise<PreviewContentUnique>>(
  async (event) => {
    // <typeOrPart>/<fullContentId>/<uniqueName>.json
    const strContentTypePathUnique =
      event.context.params!.contentTypePathUnique!.slice(0, -5);
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
      contentTypePath.type === 'topic' ? contentTypePath.topicPart : 'page',
      uniqueName,
    );
    const uniqueProse = await (async () => {
      if (isProseElement(unique.prose, headingSchema)) {
        return await ERUDIT.repository.content.uniqueHeading(
          fullId,
          contentTypePath.type === 'topic' ? contentTypePath.topicPart : 'page',
          unique.prose.id,
        );
      } else if (isProseElement(unique.prose, detailsSchema)) {
        return makeProseElement({
          schema: mixSchema,
          elementHandler: (element) => {
            element.children = unique.prose.children!;
          },
        });
      } else {
        return unique.prose;
      }
    })();
    const finalizedProse = await ERUDIT.repository.prose.finalize(uniqueProse);
    const link = (() => {
      if (contentTypePath.type === 'topic') {
        return PAGES.topic(contentTypePath.topicPart, shortId, unique.prose.id);
      }
      return PAGES[contentTypePath.type](shortId, unique.prose.id);
    })();
    const previewContentUnique: PreviewContentUnique = {
      schemaName: unique.prose.schema.name,
      elementTitle: unique.title || undefined,
      fadeOverlay: isProseElement(unique.prose, headingSchema),
      contentTitle,
      link,
      ...finalizedProse,
    };
    return previewContentUnique;
  },
);
