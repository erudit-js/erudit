import { readFileSync } from 'node:fs';
import { globSync } from 'glob';
import path from 'node:path';
import chalk from 'chalk';
import { resolvePaths } from '@erudit-js/cog/kit';
import type { ContributorConfig } from '@erudit-js/cog/schema';

import { PROJECT_DIR } from '#erudit/globalPaths';
import { stress } from '@erudit/utils/stress';
import { debug, logger } from '@server/logger';
import { ERUDIT_SERVER } from '@server/global';
import { IMPORT } from '@server/importer';
import { DbContributor } from '@server/db/entities/Contributor';

export async function buildContributors() {
    debug.start('Building contributors...');

    const contributorPaths = globSync(PROJECT_DIR + '/contributors/*/');
    for (const contributorPath of contributorPaths)
        await addContributor(resolvePaths(contributorPath));

    logger.success(
        `Contributors built successfully!`,
        chalk.dim(`(${contributorPaths.length})`),
    );
}

async function addContributor(contributorPath: string) {
    const contributorId = contributorPath.split('/').pop() as string;

    debug.start(`Adding contributor ${stress(contributorId)}...`);

    const avatarFilename = (() => {
        const avatarPaths = globSync(`${contributorPath}/avatar.*`);
        if (avatarPaths[0])
            return avatarPaths[0].split(path.sep).slice(-2).join('/');

        return undefined;
    })();

    const config: Partial<ContributorConfig> = await (async () => {
        try {
            return await IMPORT(`${contributorPath}/contributor`, {
                default: true,
            });
        } catch {
            return {};
        }
    })();

    const description = (() => {
        try {
            return readFileSync(`${contributorPath}/description.bi`, 'utf-8');
        } catch {
            return undefined;
        }
    })();

    const dbContributor = new DbContributor();
    dbContributor.contributorId = contributorId;
    dbContributor.avatar = avatarFilename;
    dbContributor.displayName = config.displayName;
    dbContributor.isEditor = Boolean(config.editor);
    dbContributor.slogan = config.slogan;
    dbContributor.links = config.links;
    dbContributor.description = description;

    await ERUDIT_SERVER.DB.manager.save(dbContributor);
}
