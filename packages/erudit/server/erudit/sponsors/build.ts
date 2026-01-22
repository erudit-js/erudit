import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { eq } from 'drizzle-orm';
import type { Sponsor, SponsorConfig } from '@erudit-js/core/sponsor';

let initialBuild = true;

const sponsorsRoot = () => `${ERUDIT.config.paths.project}/sponsors`;

export async function buildSponsors() {
    if (!ERUDIT.config.public.project.sponsors?.enabled) {
        return;
    }

    ERUDIT.log.debug.start('Building sponsors...');

    const isInitial = initialBuild;
    initialBuild = false;

    const sponsorIds = collectSponsorIds(isInitial);

    if (!sponsorIds.size) {
        ERUDIT.log.info(
            isInitial
                ? 'Skipping sponsors — no sponsors found.'
                : 'Skipping sponsors — nothing changed.',
        );
        return;
    }

    for (const sponsorId of sponsorIds) {
        await cleanupSponsor(sponsorId);
    }

    const existingIds = [...sponsorIds].filter((id) =>
        existsSync(`${sponsorsRoot()}/${id}`),
    );

    if (!existingIds.length) {
        return;
    }

    for (const sponsorId of existingIds) {
        await buildSponsor(sponsorId);
    }

    ERUDIT.log.success(
        isInitial
            ? `Sponsors build complete! (${ERUDIT.log.stress(sponsorIds.size)})`
            : `Sponsors updated: ${ERUDIT.log.stress(existingIds.join(', '))}`,
    );
}

//
//
//

function collectSponsorIds(initial: boolean): Set<string> {
    if (initial) {
        try {
            return new Set(
                readdirSync(sponsorsRoot(), { withFileTypes: true })
                    .filter((entry) => entry.isDirectory())
                    .map((entry) => entry.name),
            );
        } catch {
            return new Set();
        }
    }

    const ids = new Set<string>();

    for (const file of ERUDIT.changedFiles.values()) {
        if (!file.startsWith(`${sponsorsRoot()}/`)) continue;
        const id = file.replace(`${sponsorsRoot()}/`, '').split('/')[0];
        if (id) ids.add(id);
    }

    return ids;
}

async function cleanupSponsor(sponsorId: string) {
    await ERUDIT.db
        .delete(ERUDIT.db.schema.sponsors)
        .where(eq(ERUDIT.db.schema.sponsors.sponsorId, sponsorId));

    await ERUDIT.db
        .delete(ERUDIT.db.schema.files)
        .where(eq(ERUDIT.db.schema.files.role, 'sponsor-avatar'));
}

async function buildSponsor(sponsorId: string) {
    ERUDIT.log.debug.start(
        `Building sponsor ${ERUDIT.log.stress(sponsorId)}...`,
    );

    const dir = `${sponsorsRoot()}/${sponsorId}`;
    const files = readdirSync(dir);

    const hasConfig = files.some(
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
            `${dir}/sponsor`,
        )) as SponsorConfig;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        ERUDIT.log.error(
            `Failed to load config for sponsor ${ERUDIT.log.stress(sponsorId)}: ${message}`,
        );
        return;
    }

    const avatarExtension = files
        .find((file) => file.startsWith('avatar.'))
        ?.split('.')
        .pop();

    if (avatarExtension) {
        await ERUDIT.repository.db.pushFile(
            `${dir}/avatar.${avatarExtension}`,
            'sponsor-avatar',
        );
    }

    const icon = (() => {
        if (sponsorConfig.icon) {
            return sponsorConfig.icon;
        }

        const iconFile = files.find((file) => file === 'icon.svg');
        if (iconFile) {
            return readFileSync(dir + '/' + iconFile, 'utf-8');
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
