import { readdirSync, readFileSync } from 'node:fs';
import { eq } from 'drizzle-orm';
import type { Sponsor, SponsorConfig } from '@erudit-js/core/sponsor';

export async function buildSponsors() {
    if (!ERUDIT.config.public.project.sponsors?.enabled) {
        return;
    }

    ERUDIT.log.debug.start('Building sponsors...');

    await ERUDIT.db.delete(ERUDIT.db.schema.sponsors);
    await ERUDIT.db
        .delete(ERUDIT.db.schema.files)
        .where(eq(ERUDIT.db.schema.files.role, 'sponsor-avatar'));

    let sponsorIds: string[] = [];

    try {
        sponsorIds = readdirSync(ERUDIT.config.paths.project + '/sponsors', {
            withFileTypes: true,
        })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
    } catch {}

    let sponsorCount = 0;

    for (const sponsorId of sponsorIds) {
        await buildSponsor(sponsorId);
        sponsorCount++;
    }

    ERUDIT.log.success(
        `Sponsors build complete! (${ERUDIT.log.stress(sponsorCount)})`,
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

    let sponsorConfig: SponsorConfig;

    try {
        sponsorConfig = (await ERUDIT.import(
            `${sponsorDirectory}/sponsor`,
        )) as SponsorConfig;
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

    if (avatarExtension) {
        await ERUDIT.repository.db.pushFile(
            `${sponsorDirectory}/avatar.${avatarExtension}`,
            'sponsor-avatar',
        );
    }

    const icon = (() => {
        if (sponsorConfig.icon) {
            return sponsorConfig.icon;
        }

        const iconFile = sponsorFiles.find((file) => file === 'icon.svg');
        if (iconFile) {
            return readFileSync(sponsorDirectory + '/' + iconFile, 'utf-8');
        }
    })();

    const sponsor: Sponsor = {
        sponsorId,
        name: sponsorConfig.name,
        group: sponsorConfig.group,
        icon,
        avatarExtension,
        info: sponsorConfig.info,
        color: sponsorConfig.color,
        link: sponsorConfig.link,
        messages: sponsorConfig.messages,
    };

    await ERUDIT.db.insert(ERUDIT.db.schema.sponsors).values({
        sponsorId,
        hasMessages: sponsor.messages?.enabled === true,
        avatarExtension: sponsor.avatarExtension,
        data: sponsor,
    });
}
