import { inArray, or } from 'drizzle-orm';
import { contentPathToId } from '@erudit-js/core/content/path';

import { parseGroup } from './group';
import { parseBook } from './book';
import { parsePage } from './page';
import { parseTopic } from './topic';

let initialParse = true;

export async function parseContent() {
    ERUDIT.log.debug.start('Parsing content...');

    let toParseContentIds = new Set<string>();
    if (initialParse) {
        initialParse = false;
        toParseContentIds = new Set(ERUDIT.contentNav.id2Node.keys());
    } else {
        for (const changedFile of ERUDIT.changedFiles.values()) {
            const contentId = contentPathToId(
                changedFile,
                ERUDIT.config.paths.project,
                'full',
            );

            const navNode = ERUDIT.contentNav.getNode(contentId || '');

            if (navNode) {
                await ERUDIT.contentNav.walk((node) => {
                    toParseContentIds.add(node.fullId);
                }, navNode);
            }
        }

        await clearOldContentData(Array.from(toParseContentIds));
    }

    for (const contentId of toParseContentIds) {
        const navNode = ERUDIT.contentNav.getNodeOrThrow(contentId);
        switch (navNode.type) {
            case 'book':
                await parseBook(navNode);
                break;
            case 'group':
                await parseGroup(navNode);
                break;
            case 'page':
                await parsePage(navNode);
                break;
            case 'topic':
                await parseTopic(navNode);
                break;
        }
    }
}

export async function clearOldContentData(contentIds: string[]) {
    await ERUDIT.db
        .delete(ERUDIT.db.schema.content)
        .where(inArray(ERUDIT.db.schema.content.fullId, contentIds));

    await ERUDIT.db
        .delete(ERUDIT.db.schema.groups)
        .where(inArray(ERUDIT.db.schema.groups.fullId, contentIds));

    await ERUDIT.db
        .delete(ERUDIT.db.schema.pages)
        .where(inArray(ERUDIT.db.schema.pages.fullId, contentIds));

    await ERUDIT.db
        .delete(ERUDIT.db.schema.topics)
        .where(inArray(ERUDIT.db.schema.topics.fullId, contentIds));

    await ERUDIT.db.delete(ERUDIT.db.schema.files).where(
        inArray(
            ERUDIT.db.schema.files.role,
            contentIds.map((id) => `content-item:${id}`),
        ),
    );

    await ERUDIT.db
        .delete(ERUDIT.db.schema.contentProseLinks)
        .where(
            or(
                inArray(
                    ERUDIT.db.schema.contentProseLinks.fromContentId,
                    contentIds,
                ),
            ),
        );

    await ERUDIT.db
        .delete(ERUDIT.db.schema.contentUniques)
        .where(
            inArray(ERUDIT.db.schema.contentUniques.contentFullId, contentIds),
        );

    await ERUDIT.db
        .delete(ERUDIT.db.schema.contentSnippets)
        .where(
            inArray(ERUDIT.db.schema.contentSnippets.contentFullId, contentIds),
        );

    await ERUDIT.db
        .delete(ERUDIT.db.schema.problemScripts)
        .where(
            inArray(ERUDIT.db.schema.problemScripts.contentFullId, contentIds),
        );
}
