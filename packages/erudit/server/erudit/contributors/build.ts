import { readdirSync } from 'node:fs';
import { isRawElement, type AnySchema, type ProseElement } from '@jsprose/core';
import type { ContributorDefinition } from '@erudit-js/core/contributor';

import * as virtualContributors from '#erudit/contributors';

export async function buildContributors() {
    ERUDIT.log.debug.start('Building contributors...');

    await ERUDIT.db.delete(ERUDIT.db.schema.contributors);

    let contributorIds: string[] = Object.values(virtualContributors).map(
        (vc) => vc.contributorId,
    );

    for (const contributorId of contributorIds) {
        await buildContributor(contributorId);
    }

    ERUDIT.log.success(
        `Contributors build complete! (${ERUDIT.log.stress(contributorIds.length)})`,
    );
}

async function buildContributor(contributorId: string) {
    ERUDIT.log.debug.start(
        `Building contributor ${ERUDIT.log.stress(contributorId)}...`,
    );

    const directory = `${ERUDIT.config.paths.project}/contributors/${contributorId}`;
    const files = readdirSync(directory);

    const avatarExtension = files
        .find((file) => file.startsWith('avatar.'))
        ?.split('.')
        .pop();

    if (avatarExtension) {
        await ERUDIT.db
            .insert(ERUDIT.db.schema.files)
            .values({
                path: `${directory}/avatar.${avatarExtension}`,
            })
            .onConflictDoNothing();
    }

    let moduleDefault: ContributorDefinition | undefined;

    try {
        moduleDefault = await ERUDIT.import(`${directory}/contributor`);
    } catch (error) {
        if (!String(error).includes('Cannot find module')) {
            ERUDIT.log.error(
                `Failed to load contributor ${ERUDIT.log.stress(contributorId)} module:\n`,
            );
            console.log(error);
        }
    }

    let description: ProseElement<AnySchema> | undefined;

    if (isRawElement(moduleDefault?.description)) {
        const resolveResult = await ERUDIT.repository.prose.resolve(
            moduleDefault.description,
            false,
        );

        await ERUDIT.repository.prose.applyResolved.files(resolveResult.files);

        description = resolveResult.proseElement;
    }

    await ERUDIT.db.insert(ERUDIT.db.schema.contributors).values({
        contributorId,
        avatarExtension,
        displayName: moduleDefault?.displayName,
        slogan: moduleDefault?.slogan,
        links: moduleDefault?.links,
        editor: moduleDefault?.editor,
        description: description,
    });
}
