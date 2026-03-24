import { eq } from 'drizzle-orm';

export async function getContentLastmod(
  fullId: string,
): Promise<string | undefined> {
  const result = await ERUDIT.db.query.content.findFirst({
    columns: { lastmod: true },
    where: eq(ERUDIT.db.schema.content.fullId, fullId),
  });

  return result?.lastmod ?? undefined;
}
