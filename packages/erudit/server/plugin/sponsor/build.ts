import chalk from 'chalk';
import { glob } from 'glob';
import type { Sponsor, SponsorConfig } from '@erudit-js/cog/schema';

import { PROJECT_DIR } from '#erudit/globalPaths';
import { ERUDIT_SERVER } from '@server/global';
import { debug, logger } from '@server/logger';

import { getSponsorCount, readSponsorConfig } from './repository';

export async function buildSponsors() {
    if (!ERUDIT_SERVER.CONFIG.sponsors) {
        return;
    }

    debug.start('Building sponsors...');

    const sponsorIds = await searchSponsorIds();

    if (sponsorIds.length === 0) {
        logger.warn('No sponsors found!');
        return;
    }

    ERUDIT_SERVER.SPONSORS = {
        tier1Ids: [],
        tier2Ids: [],
        avatars: {},
    };

    for (const sponsorId of sponsorIds) {
        const sponsorAvatar = await searchSponsorAvatar(sponsorId);

        let config: SponsorConfig<Sponsor>;
        try {
            config = await readSponsorConfig(sponsorId);
        } catch (error) {
            logger.error(
                `Failed to read sponsor config for: ${sponsorId}! ${error}`,
            );
            continue;
        }

        if (config.tier === 'tier1') {
            ERUDIT_SERVER.SPONSORS.tier1Ids.push(sponsorId);
        } else if (config.tier === 'tier2') {
            ERUDIT_SERVER.SPONSORS.tier2Ids.push(sponsorId);
        } else {
            logger.warn(
                `Sponsor ${sponsorId} has an unknown tier: ${config.tier}!`,
            );
            continue;
        }

        ERUDIT_SERVER.SPONSORS.avatars[sponsorId] = sponsorAvatar;
    }

    logger.success(
        `Sponsors built successfully!`,
        chalk.dim(`(${getSponsorCount()})`),
    );
}

async function searchSponsorIds() {
    const dirs = await glob(PROJECT_DIR + '/sponsors/*/sponsor.{ts,js}', {
        posix: true,
    });

    return dirs.map((dir) => dir.split('/').slice(-2, -1)[0]!);
}

export async function searchSponsorAvatar(
    sponsorId: string,
): Promise<string | undefined> {
    const pattern = `sponsors/${sponsorId}/avatar.*`;
    const avatars = await glob(pattern, {
        cwd: PROJECT_DIR,
        posix: true,
    });

    return avatars.pop();
}
