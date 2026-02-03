import { eq } from 'drizzle-orm';

export async function getContentSeo(fullContentId: string) {
  const dbContentItem = await ERUDIT.db.query.content.findFirst({
    columns: {
      seo: true,
    },
    where: eq(ERUDIT.db.schema.content.fullId, fullContentId),
  });

  return dbContentItem?.seo || undefined;
}
