import { eq } from 'drizzle-orm';
import type { ContentFlags } from '@erudit-js/core/content/flags';

export async function getContentFlags(
  fullId: string,
): Promise<ContentFlags | undefined> {
  const flags: ContentFlags = {};

  const parts = fullId.split('/');
  for (let i = 1; i <= parts.length; i++) {
    const trimmedId = parts.slice(0, i).join('/');

    const dbContent = await ERUDIT.db.query.content.findFirst({
      columns: { flags: true },
      where: eq(ERUDIT.db.schema.content.fullId, trimmedId),
    });

    const dbFlags = dbContent?.flags || {};

    for (const [key, value] of Object.entries(dbFlags) as [
      keyof ContentFlags,
      boolean,
    ][]) {
      if (value === false) {
        delete flags[key];
      } else {
        flags[key] = value;
      }
    }
  }

  return Object.keys(flags).length > 0 ? flags : undefined;
}
