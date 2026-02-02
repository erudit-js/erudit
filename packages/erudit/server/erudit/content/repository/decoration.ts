import { eq } from 'drizzle-orm';

export async function getContentDecoration(fullId: string) {
  const parts = fullId.split('/');
  for (let i = parts.length; i > 0; i--) {
    const trimmedId = parts.slice(0, i).join('/');

    const dbContent = await ERUDIT.db.query.content.findFirst({
      columns: { decorationExtension: true },
      where: eq(ERUDIT.db.schema.content.fullId, trimmedId),
    });

    if (dbContent?.decorationExtension) {
      const navNode = ERUDIT.contentNav.getNodeOrThrow(trimmedId);
      return (
        'content/' +
        navNode.contentRelPath +
        '/decoration.' +
        dbContent.decorationExtension
      );
    }
  }
}
