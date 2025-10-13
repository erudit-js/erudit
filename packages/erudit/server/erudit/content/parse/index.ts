import { ContentType } from '@erudit-js/cog/schema';
import { notInArray, inArray } from 'drizzle-orm';

import type { ContentNavNode } from '../nav/types';

// Parsers
import { booksParser } from './types/books';
import { groupsParser } from './types/groups';
import { pagesParser } from './types/pages';
import { topicsParser } from './types/topics';
import chalk from 'chalk';

export type ContentParser = () => Promise<{
    step: (navNode: ContentNavNode) => Promise<void>;
    finally?: () => Promise<void>;
}>;

const parsers: Record<ContentType, ContentParser> = {
    [ContentType.Book]: booksParser,
    [ContentType.Group]: groupsParser,
    [ContentType.Page]: pagesParser,
    [ContentType.Topic]: topicsParser,
};

export async function parseContent() {
    ERUDIT.log.debug.start('Parsing content...');

    const createdParsers = new Map<
        ContentType,
        Awaited<ReturnType<ContentParser>>
    >();

    for (const type of Object.keys(parsers) as ContentType[]) {
        const parser = parsers[type];
        createdParsers.set(type, await parser());
    }

    const fullIdsToReparce: Set<string> = new Set();
    const contentBasePath = ERUDIT.config.paths.project + '/content/';

    const nodesByPathLength = Array.from(
        ERUDIT.contentNav.id2Node.values(),
    ).sort((a, b) => b.contentRelPath.length - a.contentRelPath.length);

    for (const changedFile of ERUDIT.changedFiles.values()) {
        const matchingNode = nodesByPathLength.find((node) =>
            changedFile.startsWith(contentBasePath + node.contentRelPath),
        );

        if (matchingNode) {
            fullIdsToReparce.add(matchingNode.fullId);
        }
    }

    if (fullIdsToReparce.size > 0) {
        const ancestorIds = Array.from(fullIdsToReparce);
        for (const node of ERUDIT.contentNav.id2Node.values()) {
            for (const anc of ancestorIds) {
                if (
                    node.fullId.length > anc.length &&
                    node.fullId.startsWith(anc + '/')
                ) {
                    fullIdsToReparce.add(node.fullId);
                    break;
                }
            }
        }
    }

    const allFullIds = Array.from(ERUDIT.contentNav.id2Node.keys());
    const reparseFullIds = Array.from(fullIdsToReparce);

    await clearUnusedReparseContent(allFullIds, reparseFullIds);

    const idsToProcess =
        fullIdsToReparce.size > 0 ? fullIdsToReparce : allFullIds;

    for (const fullId of idsToProcess) {
        const node = ERUDIT.contentNav.id2Node.get(fullId)!;

        ERUDIT.log.debug.start(
            `Parsing ${node.type} ${ERUDIT.log.stress(node.fullId)}...`,
        );

        try {
            await createdParsers.get(node.type)!.step(node);
        } catch (error) {
            ERUDIT.log.error(
                `
Error parsing ${node.type} ${ERUDIT.log.stress(node.fullId)}!
Location: ${chalk.redBright(ERUDIT.config.paths.project + '/content/' + node.contentRelPath)}
            `.trim(),
            );

            throw error;
        }
    }

    for (const parser of createdParsers.values()) {
        parser.finally && (await parser.finally());
    }

    ERUDIT.log.success('Content parsed successfully!');
}

async function clearUnusedReparseContent(
    allFullIds: string[],
    reparseFullIds: string[],
) {
    try {
        const deletePromises = [];

        const deleteFromTables = (
            ids: string[],
            condition: typeof notInArray | typeof inArray,
        ) => {
            const tables = [
                {
                    table: ERUDIT.db.schema.content,
                    column: ERUDIT.db.schema.content.fullId,
                },
                {
                    table: ERUDIT.db.schema.topics,
                    column: ERUDIT.db.schema.topics.fullId,
                },
                {
                    table: ERUDIT.db.schema.uniques,
                    column: ERUDIT.db.schema.uniques.contentFullId,
                },
                {
                    table: ERUDIT.db.schema.pages,
                    column: ERUDIT.db.schema.pages.fullId,
                },
                {
                    table: ERUDIT.db.schema.groups,
                    column: ERUDIT.db.schema.groups.fullId,
                },
                {
                    table: ERUDIT.db.schema.snippets,
                    column: ERUDIT.db.schema.snippets.contentFullId,
                },
            ];

            return tables.map(({ table, column }) =>
                ERUDIT.db.delete(table).where(condition(column as any, ids)),
            );
        };

        deletePromises.push(...deleteFromTables(allFullIds, notInArray));

        if (reparseFullIds.length > 0) {
            deletePromises.push(...deleteFromTables(reparseFullIds, inArray));
        }

        await Promise.all(deletePromises);
    } catch (e) {
        console.error(
            'Error cleaning unused and to-reparse content before parse:',
            e,
        );
    }
}
