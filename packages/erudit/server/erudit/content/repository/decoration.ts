import { eq } from 'drizzle-orm';

function buildDecorationPath(fullId: string, extension: string) {
  const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);
  return 'content/' + navNode.contentRelPath + '/decoration.' + extension;
}

export async function getContentDecoration(fullId: string) {
  const parts = fullId.split('/');
  for (let i = parts.length; i > 0; i--) {
    const trimmedId = parts.slice(0, i).join('/');

    const dbContent = await ERUDIT.db.query.content.findFirst({
      columns: { decorationExtension: true },
      where: eq(ERUDIT.db.schema.content.fullId, trimmedId),
    });

    if (dbContent?.decorationExtension) {
      return buildDecorationPath(trimmedId, dbContent.decorationExtension);
    }
  }
}

export async function getContentOwnDecoration(fullId: string) {
  const dbContent = await ERUDIT.db.query.content.findFirst({
    columns: { decorationExtension: true },
    where: eq(ERUDIT.db.schema.content.fullId, fullId),
  });

  if (dbContent?.decorationExtension) {
    return buildDecorationPath(fullId, dbContent.decorationExtension);
  }
}
