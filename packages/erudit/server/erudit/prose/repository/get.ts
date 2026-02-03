import { eq } from 'drizzle-orm';
import type { AnySchema, ProseElement } from '@jsprose/core';
import type { ContentProseType } from '@erudit-js/core/content/prose';
import { isTopicPart } from '@erudit-js/core/content/topic';

export async function getContentProse(
  contentType: ContentProseType,
  contentId: string,
): Promise<ProseElement<AnySchema>> {
  const navNode = ERUDIT.contentNav.getNodeOrThrow(contentId);
  const fullContentId = navNode.fullId;

  if (isTopicPart(contentType)) {
    const dbTopic = (await ERUDIT.db.query.topics.findFirst({
      columns: {
        [contentType]: true,
      },
      where: eq(ERUDIT.db.schema.topics.fullId, fullContentId),
    }))!;

    // @ts-expect-error we know that contentType is a valid key here
    return dbTopic[contentType]!;
  }

  if (contentType === 'page') {
    const dbPage = (await ERUDIT.db.query.pages.findFirst({
      columns: {
        prose: true,
      },
      where: eq(ERUDIT.db.schema.pages.fullId, fullContentId),
    }))!;
    return dbPage.prose;
  }

  throw createError({
    statusCode: 400,
    statusMessage: `Unable to get prose for content ${contentType} "${contentId}"!`,
  });
}

export async function getContributorProse(
  contributorId: string,
): Promise<ProseElement<AnySchema> | undefined> {
  const dbContributor = await ERUDIT.db.query.contributors.findFirst({
    columns: {
      description: true,
    },
    where: eq(ERUDIT.db.schema.contributors.contributorId, contributorId),
  });

  return dbContributor?.description || undefined;
}

// @TODO: Get news item prose
