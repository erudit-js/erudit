import { existsSync } from 'node:fs';
import { globSync } from 'glob';
import chalk from 'chalk';
import sizeOf from 'image-size';
import {
    contentTypes,
    type ContentConfig,
    type ContentReferences,
    type ContentType,
} from 'erudit-cog/schema';
import { resolvePaths } from 'erudit-cog/kit';

import { PROJECT_DIR } from '#erudit/globalPaths';
import { stress } from '@erudit/utils/stress';

import { debug, logger } from '@server/logger';
import { ERUDIT_SERVER } from '@server/global';
import { walkNav } from '@server/nav/utils';
import { isRootNode, type NavNode } from '@server/nav/node';
import { DbContent } from '@server/db/entities/Content';
import { IMPORT } from '@server/importer';
import { contributorExists } from '@server/repository/contributor';
import { DbContribution } from '@server/db/entities/Contribution';

import { contentAsset } from '@erudit/shared/asset';
import type { ImageData } from '@erudit/shared/image';

import type { BuilderFunctionArgs } from './builderArgs';
import { contentItemPath } from './path';
import { buildBook } from './type/book';
import { buildGroup } from './type/group';
import { buildTopic } from './type/topic';

const typeBuilders: Record<ContentType, Function> = {
    book: buildBook,
    group: buildGroup,
    topic: buildTopic,
};

export async function buildContent() {
    if (!ERUDIT_SERVER.NAV) return;

    debug.start('Building content...');

    const counters: Record<ContentType, number> = Object.fromEntries(
        contentTypes.map((contentType) => [contentType, 0]),
    ) as any;

    await walkNav(async (node) => {
        if (isRootNode(node)) return;
        counters[node.type]++;
        await addContentItem(node);
    });

    logger.success(
        'Content built successfully!',
        chalk.dim(
            '(' +
                Object.entries(counters)
                    .map(([k, v]) => `${k.at(0)!.toUpperCase()}: ${v}`)
                    .join(', ') +
                ')',
        ),
    );
}

async function addContentItem(navNode: NavNode) {
    debug.start(
        `Adding ${stress(navNode.type)} content item ${stress(navNode.id)}...`,
    );

    const dbContent = new DbContent();
    dbContent.contentId = navNode.id;
    dbContent.fullId = navNode.fullId;
    dbContent.type = navNode.type;
    dbContent.decoration = getDecoration(navNode);
    dbContent.ogImage = getOgImageData(navNode);
    dbContent.references = await getContentReferences(navNode);

    let config: Partial<ContentConfig> | undefined;

    try {
        config = (await IMPORT(contentItemPath(navNode, navNode.type), {
            default: true,
        })) as Partial<ContentConfig>;

        dbContent.title = config.title;
        dbContent.navTitle = config.navTitle;
        dbContent.description = config.description;
        dbContent.flags = config.flags;
        dbContent.dependencies = config.dependencies;

        if (config.seo) {
            dbContent.seo = {
                title: config.seo?.title,
                description: config.seo?.description,
            };
        }

        await addContributions(navNode, config.contributors);
    } catch {}

    await ERUDIT_SERVER.DB.manager.save(dbContent);

    await typeBuilders[navNode.type](<BuilderFunctionArgs>{
        navNode,
        dbContent,
        config,
    });
}

function getDecoration(navNode: NavNode) {
    if (existsSync(contentItemPath(navNode, 'decoration.svg')))
        return `/${navNode.path}/decoration.svg`;

    return undefined;
}

async function addContributions(navNode: NavNode, contributors?: string[]) {
    if (!contributors || !contributors.length) {
        if (navNode.type !== 'book' && navNode.type !== 'group')
            logger.warn(
                `${navNode.type.at(0)!.toUpperCase() + navNode.type.slice(1)} ${stress(navNode.id)} has no contributors!`,
            );

        return;
    }

    for (const contributorId of contributors) {
        if (!(await contributorExists(contributorId))) {
            logger.warn(
                `Skipping unknown contributor ${stress(contributorId)} when adding ${navNode.type} ${stress(navNode.id)}!`,
            );
            continue;
        }

        const dbContribution = new DbContribution();
        dbContribution.contentId = navNode.id;
        dbContribution.contributorId = contributorId;
        await ERUDIT_SERVER.DB.manager.save(dbContribution);
    }
}

function getOgImageData(navNode: NavNode): ImageData | undefined {
    const ogImagePath = globSync(
        contentItemPath(navNode, 'og-image.{svg,webp,jpg,png}'),
    ).pop();

    if (ogImagePath) {
        const size = sizeOf(ogImagePath);
        return {
            src: contentAsset(
                resolvePaths(ogImagePath).replace(
                    PROJECT_DIR + '/content/',
                    '',
                ),
            ),
            width: size.width!,
            height: size.height!,
        };
    }

    return undefined;
}

async function getContentReferences(navNode: NavNode) {
    try {
        const references = await IMPORT(
            contentItemPath(navNode, `references`),
            { default: true },
        );
        return references as ContentReferences;
    } catch (error) {}

    return undefined;
}
