import { eq } from 'drizzle-orm';
import type { ProseElement } from 'tsprose';
import type { ContentProseType } from '@erudit-js/core/content/prose';
import { isTopicPart } from '@erudit-js/core/content/topic';

export async function getContentProse(
  contentType: ContentProseType,
  contentId: string,
): Promise<ProseElement> {
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
): Promise<ProseElement | undefined> {
  const dbContributor = await ERUDIT.db.query.contributors.findFirst({
    columns: {
      description: true,
    },
    where: eq(ERUDIT.db.schema.contributors.contributorId, contributorId),
  });

  return dbContributor?.description || undefined;
}
