import { readdirSync } from 'node:fs';
import type { Sponsor } from '@erudit-js/core/sponsor';

import { SPONSORS } from '.';

export async function buildSponsors() {
    ERUDIT.log.debug.start('Building sponsors...');

    let sponsorIds: string[] = [];

    try {
        sponsorIds = readdirSync(ERUDIT.config.paths.project + '/sponsors', {
            withFileTypes: true,
        })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
    } catch {}

    for (const sponsorId of sponsorIds) {
        await buildSponsor(sponsorId);
    }

    ERUDIT.log.success(
        `Sponsors build complete! (${ERUDIT.log.stress(ERUDIT.repository.sponsors.count().all)})`,
    );
}

async function buildSponsor(sponsorId: string) {
    ERUDIT.log.debug.start(
        `Building sponsor ${ERUDIT.log.stress(sponsorId)}...`,
    );

    const sponsorDirectory =
        ERUDIT.config.paths.project + '/sponsors/' + sponsorId;
    const sponsorFiles = readdirSync(sponsorDirectory);

    const hasConfig = sponsorFiles.some(
        (file) => file === 'sponsor.ts' || file === 'sponsor.js',
    );

    if (!hasConfig) {
        ERUDIT.log.error(
            `No config file found for sponsor ${ERUDIT.log.stress(sponsorId)}!`,
        );
        return;
    }

    let sponsorConfig: Sponsor;

    try {
        sponsorConfig = (await ERUDIT.import(
            `${sponsorDirectory}/sponsor`,
        )) as Sponsor;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        ERUDIT.log.error(
            `Failed to load config for sponsor ${ERUDIT.log.stress(sponsorId)}: ${message}`,
        );
        return;
    }

    const avatarExtension = sponsorFiles
        .find((file) => file.startsWith('avatar.'))
        ?.split('.')
        .pop();

    SPONSORS[sponsorConfig.tier][sponsorId] = {
        // @ts-ignore
        ...sponsorConfig.default,
        sponsorId,
        avatarExtension,
    };
}
