import { eq } from 'drizzle-orm';

export async function isContentHidden(fullId: string): Promise<boolean> {
  if (ERUDIT.mode !== 'static') {
    return false;
  }

  const dbContentItem = await ERUDIT.db.query.content.findFirst({
    columns: { type: true, hidden: true },
    where: eq(ERUDIT.db.schema.content.fullId, fullId),
  });

  if (!dbContentItem) {
    throw createError(`Content with fullId "${fullId}" not found!`);
  }

  if (dbContentItem.hidden) {
    return true;
  }

  const isBook = dbContentItem.type === 'book';
  const isGroup = dbContentItem.type === 'group';

  if (isBook || isGroup) {
    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);
    let hasVisibleChild = false;
    for (const child of navNode.children ?? []) {
      const childHidden = await isContentHidden(child.fullId);
      if (!childHidden) {
        hasVisibleChild = true;
        break;
      }
    }
    return hasVisibleChild ? false : true;
  }

  return false;
}
