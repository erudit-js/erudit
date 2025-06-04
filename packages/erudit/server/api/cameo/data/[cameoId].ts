import { glob } from 'glob';
import { type Cameo } from '@erudit-js/cog/schema';

import { PROJECT_DIR } from '@erudit/globalPath';
import { IMPORT } from '@server/importer';

export default defineEventHandler<Promise<Cameo>>(async (event) => {
    const cameoId = event.context.params?.cameoId;

    if (typeof cameoId !== 'string' || !cameoId) {
        throw createError({
            statusCode: 400,
            message: 'Cameo ID is required and must be a string!',
        });
    }

    const avatarPaths = await glob(`cameos/${cameoId}/avatars/*`, {
        cwd: PROJECT_DIR,
        absolute: false,
        posix: true,
    });

    const avatarRoutes = avatarPaths.map((path) => `/asset/${path}`);

    let cameoConfig;
    try {
        cameoConfig = await IMPORT(`${PROJECT_DIR}/cameos/${cameoId}/cameo`, {
            default: true,
        });
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Failed to import config for ID "${cameoId}"! Error: ${error}`,
        });
    }

    return {
        ...cameoConfig,
        cameoId,
        avatars: avatarRoutes,
    } satisfies Cameo;
});
