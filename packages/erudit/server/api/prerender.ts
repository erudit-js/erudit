import {
    encodeBitranLocation,
    parseBitranLocation,
    stringifyBitranLocation,
} from '@erudit-js/cog/schema';

import { DbUnique } from '@server/db/entities/Unique';
import { ERUDIT_SERVER } from '@server/global';
import { DbBook } from '@server/db/entities/Book';
import { DbTopic } from '@server/db/entities/Topic';
import { DbGroup } from '@server/db/entities/Group';
import { DbContributor } from '@server/db/entities/Contributor';
import { getShortContentId } from '@server/repository/contentId';

export default defineEventHandler(async () => {
    const routes: string[] = [];
    routes.push(...language());
    routes.push(...(await previewUniques()));
    routes.push(...(await previewPages()));

    return routes;
});

//
//
//

function language() {
    const phraseRoutes = Object.keys(ERUDIT_SERVER.LANGUAGE?.phrases || []).map(
        (phraseId) => `/api/language/phrase/${phraseId}`,
    );
    return ['/api/language/functions', ...phraseRoutes];
}

async function previewUniques() {
    const dbUniques = await ERUDIT_SERVER.DB.manager.find(DbUnique, {
        select: ['location'],
    });

    if (!dbUniques) {
        return [];
    }

    const routes: string[] = [];
    for (const dbUnique of dbUniques) {
        const location = parseBitranLocation(dbUnique.location);

        if (location.path) {
            location.path = await getShortContentId(location.path);
        }

        routes.push(
            `/api/preview/unique/${encodeBitranLocation(stringifyBitranLocation(location))}`,
        );
    }
    return routes;
}

async function previewPages() {
    const pageRoutes: string[] = [];

    // Books

    const dbBooks = await ERUDIT_SERVER.DB.manager.find(DbBook, {
        select: ['contentId'],
    });

    if (dbBooks) {
        for (const dbBook of dbBooks) {
            const bookId = await getShortContentId(dbBook.contentId);
            pageRoutes.push(`/api/preview/page/book/${bookId}`);
        }
    }

    // Topics

    const dbTopics = await ERUDIT_SERVER.DB.manager.find(DbTopic, {
        select: ['contentId', 'parts'],
    });

    if (dbTopics) {
        for (const dbTopic of dbTopics) {
            const topicId = await getShortContentId(dbTopic.contentId);
            for (const part of dbTopic.parts) {
                pageRoutes.push(`/api/preview/page/${part}/${topicId}`);
            }
        }
    }

    // Groups

    const dbGroups = await ERUDIT_SERVER.DB.manager.find(DbGroup, {
        select: ['contentId'],
    });

    if (dbGroups) {
        for (const dbGroup of dbGroups) {
            const groupId = await getShortContentId(dbGroup.contentId);
            pageRoutes.push(`/api/preview/page/group/${groupId}`);
        }
    }

    // Contributors

    const dbContributors = await ERUDIT_SERVER.DB.manager.find(DbContributor, {
        select: ['contributorId'],
    });

    if (dbContributors) {
        for (const dbContributor of dbContributors) {
            pageRoutes.push(
                `/api/preview/page/contributor/${dbContributor.contributorId}`,
            );
        }
    }

    // // //

    return pageRoutes;
}
