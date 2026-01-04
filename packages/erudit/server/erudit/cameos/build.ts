import { readdirSync, readFileSync } from 'node:fs';
import { eq } from 'drizzle-orm';
import type { Cameo, CameoConfig } from '@erudit-js/core/cameo';

export async function buildCameos() {
    ERUDIT.log.debug.start('Building cameos...');

    await ERUDIT.db.delete(ERUDIT.db.schema.cameos);
    await ERUDIT.db
        .delete(ERUDIT.db.schema.files)
        .where(eq(ERUDIT.db.schema.files.role, 'cameo-avatar'));

    let cameoIds: string[] = [];

    try {
        cameoIds = readdirSync(ERUDIT.config.paths.project + '/cameos', {
            withFileTypes: true,
        })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
    } catch {}

    let cameoCount = 0;

    for (const cameoId of cameoIds) {
        await buildCameo(cameoId);
        cameoCount++;
    }

    ERUDIT.log.success(
        `Cameos build complete! (${ERUDIT.log.stress(cameoCount)})`,
    );
}

async function buildCameo(cameoId: string) {
    ERUDIT.log.debug.start(`Building cameo ${ERUDIT.log.stress(cameoId)}...`);

    const cameoDirectory = ERUDIT.config.paths.project + '/cameos/' + cameoId;
    const cameoFiles = readdirSync(cameoDirectory);

    const hasConfig = cameoFiles.some(
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
        cameoConfig = (await ERUDIT.import(
            `${cameoDirectory}/cameo`,
        )) as CameoConfig;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        ERUDIT.log.error(
            `Failed to load config for cameo ${ERUDIT.log.stress(cameoId)}: ${message}`,
        );
        return;
    }

    const avatarExtension = cameoFiles
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
        `${cameoDirectory}/avatar.${avatarExtension}`,
        'cameo-avatar',
    );

    const icon = (() => {
        const iconFile = cameoFiles.find((file) => file === 'icon.svg');
        if (iconFile) {
            return readFileSync(cameoDirectory + '/' + iconFile, 'utf-8');
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
