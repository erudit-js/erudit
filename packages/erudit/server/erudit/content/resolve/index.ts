import { inArray, or } from 'drizzle-orm';
import { contentPathToId } from '@erudit-js/core/content/path';

import { resolveGroup } from './group';
import { resolveBook } from './book';
import { resolvePage } from './page';
import { resolveTopic } from './topic';

let initialResolve = true;

export async function resolveContent() {
    ERUDIT.log.debug.start('Resolving content...');

    let toResolveContentIds = new Set<string>();
    if (initialResolve) {
        initialResolve = false;
        toResolveContentIds = new Set(ERUDIT.contentNav.id2Node.keys());
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
                    toResolveContentIds.add(node.fullId);
                }, navNode);
            }
        }

        await clearOldContentData(Array.from(toResolveContentIds));
    }

    for (const contentId of toResolveContentIds) {
        const navNode = ERUDIT.contentNav.getNodeOrThrow(contentId);
        switch (navNode.type) {
            case 'book':
                await resolveBook(navNode);
                break;
            case 'group':
                await resolveGroup(navNode);
                break;
            case 'page':
                await resolvePage(navNode);
                break;
            case 'topic':
                await resolveTopic(navNode);
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
            contentIds.flatMap((id) => [
                `content-item:${id}`,
                `content-decoration:${id}`,
            ]),
        ),
    );

    await ERUDIT.db
        .delete(ERUDIT.db.schema.contentElementCount)
        .where(
            inArray(ERUDIT.db.schema.contentElementCount.fullId, contentIds),
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
