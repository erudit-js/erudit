import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { eq, like } from 'drizzle-orm';
import { globSync } from 'glob';
import { isRawElement, type AnySchema, type ProseElement } from '@jsprose/core';
import {
    contributorIdToPropertyName,
    globalContributorsObject,
    globalContributorsTypes,
    type ContributorDefinition,
} from '@erudit-js/core/contributor';

$CONTRIBUTOR;

let initialBuild = true;

const contributorsRoot = () => `${ERUDIT.config.paths.project}/contributors`;

const contributorsTypesPath = () =>
    `${ERUDIT.config.paths.build}/types/contributors.d.ts`;

export async function buildContributors() {
    if (!ERUDIT.config.public.project.contributors?.enabled) return;

    ERUDIT.log.debug.start('Building contributors...');

    const isInitial = initialBuild;
    initialBuild = false;

    const contributorIds = collectContributorIds(isInitial);

    if (!contributorIds.size) {
        ERUDIT.log.info(
            isInitial
                ? 'Skipping contributors — no contributors found.'
                : 'Skipping contributors — nothing changed.',
        );
        return;
    }

    for (const id of contributorIds) {
        await cleanupContributor(id);
    }

    const existingIds = [...contributorIds].filter((id) =>
        existsSync(`${contributorsRoot()}/${id}`),
    );

    syncContributorGlobals(existingIds);

    if (!existingIds.length) {
        return;
    }

    for (const id of existingIds) {
        await buildContributor(id);
    }

    ERUDIT.log.success(
        isInitial
            ? `Contributors build complete! (${ERUDIT.log.stress(contributorIds.size)})`
            : `Contributors updated: ${ERUDIT.log.stress(existingIds.join(', '))}`,
    );
}

//
//
//

function collectContributorIds(initial: boolean): Set<string> {
    if (initial) {
        return new Set(
            globSync(`${contributorsRoot()}/*/`, { posix: true }).map(
                (p) => p.split('/').at(-1)!,
            ),
        );
    }

    const ids = new Set<string>();

    for (const file of ERUDIT.changedFiles.values()) {
        if (!file.startsWith(`${contributorsRoot()}/`)) continue;
        const id = file.replace(`${contributorsRoot()}/`, '').split('/')[0];
        if (id) ids.add(id);
    }

    return ids;
}

async function cleanupContributor(contributorId: string) {
    await ERUDIT.db
        .delete(ERUDIT.db.schema.contributors)
        .where(eq(ERUDIT.db.schema.contributors.contributorId, contributorId));

    await ERUDIT.db
        .delete(ERUDIT.db.schema.files)
        .where(
            like(ERUDIT.db.schema.files.role, `contributor:${contributorId}%`),
        );

    delete $CONTRIBUTOR[contributorIdToPropertyName(contributorId)];
}

function syncContributorGlobals(contributorIds: string[]) {
    Object.assign($CONTRIBUTOR, globalContributorsObject(contributorIds));

    writeFileSync(
        contributorsTypesPath(),
        globalContributorsTypes($CONTRIBUTOR),
    );
}

async function buildContributor(contributorId: string) {
    ERUDIT.log.debug.start(
        `Building contributor ${ERUDIT.log.stress(contributorId)}...`,
    );

    const dir = `${contributorsRoot()}/${contributorId}`;
    const files = readdirSync(dir);

    const avatar = files.find((f) => f.startsWith('avatar.'));
    if (avatar) {
        await ERUDIT.repository.db.pushFile(
            `${dir}/${avatar}`,
            `contributor:${contributorId}`,
        );
    }

    let def: ContributorDefinition | undefined;

    try {
        def = await ERUDIT.import(`${dir}/contributor`);
    } catch (err) {
        if (!String(err).includes('Cannot find module')) {
            ERUDIT.log.error(`Failed to load contributor ${contributorId}:`);
            console.error(err);
        }
    }

    let description: ProseElement<AnySchema> | undefined;

    if (isRawElement(def?.description)) {
        const resolved = await ERUDIT.repository.prose.resolve(
            def.description,
            false,
        );

        for (const file of resolved.files) {
            await ERUDIT.repository.db.pushFile(
                file,
                `contributor:${contributorId}`,
            );
        }

        description = resolved.proseElement;
    }

    await ERUDIT.db.insert(ERUDIT.db.schema.contributors).values({
        contributorId,
        avatarExtension: avatar?.split('.').pop(),
        displayName: def?.displayName,
        short: def?.short,
        links: def?.links,
        editor: def?.editor,
        description,
    });
}
