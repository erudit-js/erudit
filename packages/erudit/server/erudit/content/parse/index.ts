import { ContentType } from '@erudit-js/cog/schema';

import type { ContentNavNode } from '../nav/types';

// Parsers
import { booksParser } from './types/books';
import { groupsParser } from './types/groups';
import { pagesParser } from './types/pages';
import { topicsParser } from './types/topics';

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

    for (const node of ERUDIT.contentNav.id2Node.values()) {
        ERUDIT.log.debug.start(
            `Parsing ${node.type} ${ERUDIT.log.stress(node.fullId)}...`,
        );
        await createdParsers.get(node.type)!.step(node);
    }

    for (const parser of createdParsers.values()) {
        parser.finally && (await parser.finally());
    }

    ERUDIT.log.success('Content parsed successfully!');
}
