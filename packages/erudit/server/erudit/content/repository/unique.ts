import { and, eq } from 'drizzle-orm';
import {
  isProseElement,
  makeProseElement,
  mixSchema,
  WalkNoDeeper,
  walkPreSync,
  WalkStop,
  type ProseElement,
} from 'tsprose';
import type { ContentProseType } from '@erudit-js/core/content/prose';
import { headingSchema } from '@erudit-js/prose/elements/heading/core';

export async function getContentUnique(
  fullId: string,
  proseType: ContentProseType,
  uniqueName: string,
) {
  const dbContentUnique = await ERUDIT.db.query.contentUniques.findFirst({
    where: and(
      eq(ERUDIT.db.schema.contentUniques.contentFullId, fullId),
      eq(ERUDIT.db.schema.contentUniques.contentProseType, proseType),
      eq(ERUDIT.db.schema.contentUniques.uniqueName, uniqueName),
    ),
  });

  if (!dbContentUnique) {
    throw createError({
      statusCode: 404,
      message: `Content unique with name "${uniqueName}" for content "${fullId}" and prose type "${proseType}" not found!`,
    });
  }

  return dbContentUnique;
}

export async function getContentHeadingUnique(
  fullId: string,
  proseType: ContentProseType,
  uniqueId: string,
) {
  const contentProse = await ERUDIT.repository.prose.getContent(
    proseType,
    fullId,
  );

  const afterHeadingElements: ProseElement[] = [];
  let adding = false;

  walkPreSync(contentProse, (element) => {
    if (isProseElement(element, headingSchema) && element.id === uniqueId) {
      adding = true;
    }

    if (adding) {
      afterHeadingElements.push(element);

      if (afterHeadingElements.length === 4) {
        adding = false;
        return WalkStop;
      }

      return WalkNoDeeper;
    }
  });

  const mix = makeProseElement({
    schema: mixSchema,
    elementHandler: (proseElement) => {
      proseElement.children = afterHeadingElements;
    },
  });

  return mix;
}
