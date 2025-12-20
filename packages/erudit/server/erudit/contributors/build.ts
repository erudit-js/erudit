import { readdirSync, writeFileSync } from 'node:fs';
import { like } from 'drizzle-orm';
import { globSync } from 'glob';
import { isRawElement, type AnySchema, type ProseElement } from '@jsprose/core';
import {
    globalContributorsObject,
    globalContributorsTypes,
    type ContributorDefinition,
} from '@erudit-js/core/contributor';

// Trigger globalThis update
$CONTRIBUTOR;

export async function buildContributors() {
    ERUDIT.log.debug.start('Building contributors...');

    await ERUDIT.db.delete(ERUDIT.db.schema.contributors);
    await ERUDIT.db
        .delete(ERUDIT.db.schema.files)
        .where(like(ERUDIT.db.schema.files.role, 'contributor:%'));

    const contributorIds = globSync(
        `${ERUDIT.config.paths.project}/contributors/*/`,
        { posix: true },
    ).map((dirPath) => dirPath.split('/').pop() as string);

    for (const key in $CONTRIBUTOR) {
        delete $CONTRIBUTOR[key];
    }

    Object.assign($CONTRIBUTOR, globalContributorsObject(contributorIds));

    writeFileSync(
        `${ERUDIT.config.paths.build}/types/contributors.d.ts`,
        globalContributorsTypes($CONTRIBUTOR),
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
        await ERUDIT.repository.db.pushFile(
            `${directory}/avatar.${avatarExtension}`,
            `contributor:${contributorId}`,
        );
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

        for (const file of resolveResult.files) {
            await ERUDIT.repository.db.pushFile(
                file,
                `contributor:${contributorId}`,
            );
        }

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
