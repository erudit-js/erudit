import { Not } from 'typeorm';
import type { ContentType } from '@erudit-js/cog/schema';

import { ERUDIT_SERVER } from '@server/global';
import { DbTopic } from '@server/db/entities/Topic';
import { getShortContentId } from '@server/repository/contentId';
import { DbContent } from '@server/db/entities/Content';
import { DbContributor } from '@server/db/entities/Contributor';

import {
    createContentLink,
    createContributorLink,
    createTopicPartLink,
} from '@shared/link';
import { trailingSlash } from '@erudit/utils/url';

export default defineEventHandler(async (event) => {
    setHeader(event, 'Content-Type', 'application/xml');

    const routes = [
        ...staticRoutes(),
        ...(await topicRoutes()),
        ...(await contentRoutes()),
        ...(await contributorsRoutes()),
    ];

    const buildUrl = ERUDIT_SERVER.CONFIG.site?.buildUrl || '';
    const baseUrl = ERUDIT_SERVER.CONFIG.site?.baseUrl || '/';

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
    .map(
        (route) =>
            `    <url>
        <loc>${trailingSlash(buildUrl + baseUrl, false) + route}</loc>
        <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    </url>`,
    )
    .join('\n')}
</urlset>`;
});

function staticRoutes() {
    const routes = ['/', '/contributors/'];

    if (ERUDIT_SERVER.CONFIG.sponsors) {
        routes.push('/sponsors/');
    }

    return routes;
}

async function topicRoutes() {
    const dbTopics = await ERUDIT_SERVER.DB.manager.find(DbTopic, {
        select: ['contentId', 'parts'],
    });

    const topicRoutes: string[] = [];

    for (const dbTopic of dbTopics) {
        const shortId = getShortContentId(dbTopic.contentId);
        for (const part of dbTopic.parts) {
            topicRoutes.push(createTopicPartLink(part, shortId));
        }
    }

    return topicRoutes;
}

async function contentRoutes() {
    const dbContentItems = await ERUDIT_SERVER.DB.manager.find(DbContent, {
        select: ['contentId', 'type'],
        where: {
            type: Not('topic' as ContentType),
        },
    });

    const contentRoutes: string[] = [];

    for (const dbContent of dbContentItems) {
        const shortId = getShortContentId(dbContent.contentId);
        contentRoutes.push(createContentLink(dbContent.type, shortId));
    }

    return contentRoutes;
}

async function contributorsRoutes() {
    const dbContributors = await ERUDIT_SERVER.DB.manager.find(DbContributor, {
        select: ['contributorId'],
    });

    const contributorRoutes: string[] = [];

    for (const dbContributor of dbContributors) {
        contributorRoutes.push(
            createContributorLink(dbContributor.contributorId),
        );
    }

    return contributorRoutes;
}
