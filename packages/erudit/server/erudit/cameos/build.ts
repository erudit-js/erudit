import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { eq } from 'drizzle-orm';
import type { Cameo, CameoConfig } from '@erudit-js/core/cameo';

let initialBuild = true;

const cameosRoot = () => ERUDIT.paths.project('cameos');

export async function buildCameos() {
    ERUDIT.log.debug.start('Building cameos...');

    const isInitial = initialBuild;
    initialBuild = false;

    const cameoIds = collectCameoIds(isInitial);

    if (!cameoIds.size) {
        ERUDIT.log.info(
            isInitial
                ? 'Skipping cameos — no cameos found.'
                : 'Skipping cameos — nothing changed.',
        );
        return;
    }

    for (const cameoId of cameoIds) {
        await cleanupCameo(cameoId);
    }

    const existingIds = [...cameoIds].filter((id) =>
        existsSync(`${cameosRoot()}/${id}`),
    );

    if (!existingIds.length) {
        return;
    }

    for (const cameoId of existingIds) {
        await buildCameo(cameoId);
    }

    ERUDIT.log.success(
        isInitial
            ? `Cameos build complete! (${ERUDIT.log.stress(cameoIds.size)})`
            : `Cameos updated: ${ERUDIT.log.stress(existingIds.join(', '))}`,
    );
}

//
//
//

function collectCameoIds(initial: boolean): Set<string> {
    if (initial) {
        try {
            return new Set(
                readdirSync(cameosRoot(), { withFileTypes: true })
                    .filter((entry) => entry.isDirectory())
                    .map((entry) => entry.name),
            );
        } catch {
            return new Set();
        }
    }

    const ids = new Set<string>();

    for (const file of ERUDIT.changedFiles.values()) {
        if (!file.startsWith(`${cameosRoot()}/`)) continue;
        const id = file.replace(`${cameosRoot()}/`, '').split('/')[0];
        if (id) ids.add(id);
    }

    return ids;
}

async function cleanupCameo(cameoId: string) {
    await ERUDIT.db
        .delete(ERUDIT.db.schema.cameos)
        .where(eq(ERUDIT.db.schema.cameos.cameoId, cameoId));

    await ERUDIT.db
        .delete(ERUDIT.db.schema.files)
        .where(eq(ERUDIT.db.schema.files.role, 'cameo-avatar'));
}

async function buildCameo(cameoId: string) {
    ERUDIT.log.debug.start(`Building cameo ${ERUDIT.log.stress(cameoId)}...`);

    const dir = `${cameosRoot()}/${cameoId}`;
    const files = readdirSync(dir);

    const hasConfig = files.some(
        (file) => file === 'cameo.ts' || file === 'cameo.js',
    );

    if (!hasConfig) {
        ERUDIT.log.error(
            `No config file found for cameo ${ERUDIT.log.stress(cameoId)}!`,
        );
        return;
    }

    let cameoConfig: CameoConfig;

    try {
        cameoConfig = (await ERUDIT.import(`${dir}/cameo`)) as CameoConfig;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        ERUDIT.log.error(
            `Failed to load config for cameo ${ERUDIT.log.stress(cameoId)}: ${message}`,
        );
        return;
    }

    const avatarExtension = files
        .find((file) => file.startsWith('avatar.'))
        ?.split('.')
        .pop();

    if (!avatarExtension) {
        ERUDIT.log.error(
            `No avatar file found for cameo ${ERUDIT.log.stress(cameoId)}!`,
        );
        return;
    }

    await ERUDIT.repository.db.pushFile(
        `${dir}/avatar.${avatarExtension}`,
        'cameo-avatar',
    );

    const icon = (() => {
        const iconFile = files.find((file) => file === 'icon.svg');
        if (iconFile) {
            return readFileSync(dir + '/' + iconFile, 'utf-8');
        }
    })();

    if (!icon) {
        ERUDIT.log.error(
            `No icon file found for cameo ${ERUDIT.log.stress(cameoId)}!`,
        );
        return;
    }

    const cameo: Cameo = {
        cameoId,
        name: cameoConfig.name,
        icon,
        avatarExtension,
        color: cameoConfig.color,
        link: cameoConfig.link,
        messages: cameoConfig.messages,
    };

    await ERUDIT.db.insert(ERUDIT.db.schema.cameos).values({
        cameoId: cameoId,
        data: cameo,
    });
}
