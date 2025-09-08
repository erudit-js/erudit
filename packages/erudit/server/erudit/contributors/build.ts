import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { ContributorConfig } from '@erudit-js/cog/schema';

export async function buildContributors() {
    ERUDIT.log.debug.start('Building contributors...');

    await ERUDIT.db.delete(ERUDIT.db.schema.contributors);

    let contributorIds: string[] = [];

    try {
        contributorIds = readdirSync(
            ERUDIT.config.paths.project + '/contributors',
            { withFileTypes: true },
        )
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
    } catch {}

    for (const contributorId of contributorIds) {
        await buildContributor(contributorId);
    }

    ERUDIT.log.debug.start('Writing contributor TS type hints...');

    writeFileSync(
        ERUDIT.config.paths.build + '/types/contributors.ts',
        `
            export {};
            declare global {
                export type RuntimeContributor = ${contributorIds.map((id) => `'${id}'`).join(' | ')};
            }
        `,
    );

    ERUDIT.log.success(
        `Contributors build complete! (${ERUDIT.log.stress(contributorIds.length)})`,
    );
}

async function buildContributor(contributorId: string) {
    ERUDIT.log.debug.start(
        `Building contributor ${ERUDIT.log.stress(contributorId)}...`,
    );

    const contributorDirectory = `${ERUDIT.config.paths.project}/contributors/${contributorId}`;
    const contributorFiles = readdirSync(contributorDirectory);

    const avatarExtension = contributorFiles
        .find((file) => file.startsWith('avatar.'))
        ?.split('.')
        .pop();

    const hasConfig = contributorFiles.some(
        (file) => file === 'contributor.ts' || file === 'contributor.js',
    );

    let contributorConfig: Partial<ContributorConfig> | undefined;

    if (hasConfig) {
        try {
            contributorConfig = (await ERUDIT.import(
                `${contributorDirectory}/contributor`,
            )) as Partial<ContributorConfig>;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            ERUDIT.log.error(
                `Failed to load config for contributor ${ERUDIT.log.stress(contributorId)}: ${message}`,
            );
        }
    }

    let contributorDescription: string | undefined;

    try {
        contributorDescription = readFileSync(
            `${contributorDirectory}/description.bi`,
            'utf-8',
        );
    } catch {}

    await ERUDIT.db.insert(ERUDIT.db.schema.contributors).values({
        contributorId,
        avatarExtension,
        displayName: contributorConfig?.displayName,
        slogan: contributorConfig?.slogan,
        links: contributorConfig?.links,
        editor: contributorConfig?.editor,
        description: contributorDescription,
    });
}
