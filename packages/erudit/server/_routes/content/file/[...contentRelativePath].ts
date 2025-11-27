import { existsSync } from 'node:fs';
import { join, normalize } from 'node:path';

import { serveStaticFile } from '@erudit/server/staticFile';

export default defineEventHandler(async (event) => {
    const contentRelativePath = event.context.params?.contentRelativePath;

    if (!contentRelativePath) {
        throw createError({
            statusCode: 400,
            message: 'Missing "contentRelativePath" api route part!',
        });
    }

    const contentRoot = join(ERUDIT.config.paths.project, 'content');
    const fullFsPath = normalize(join(contentRoot, contentRelativePath));
    // Prevent escaping content root
    if (!fullFsPath.startsWith(contentRoot)) {
        throw createError({ statusCode: 400, message: 'Invalid path.' });
    }

    if (!existsSync(fullFsPath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `Content asset is missing!`,
            message: `Failed to find asset at "${contentRelativePath}"!`,
        });
    }

    return serveStaticFile(event, fullFsPath);
});
