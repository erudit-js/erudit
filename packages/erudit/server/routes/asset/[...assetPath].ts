import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

import { PROJECT_DIR } from '#erudit/globalPaths';

export default defineEventHandler(async (event) => {
    setHeader(event, 'Content-Type', 'application/octet-stream');
    const assetPath = event.context.params?.assetPath?.trim();

    if (typeof assetPath !== 'string' || !assetPath) {
        throw createError({
            statusCode: 400,
            message: 'Invalid asset path!',
        });
    }

    const fsPath = PROJECT_DIR + '/' + assetPath;

    if (!existsSync(fsPath)) {
        throw createError({
            statusCode: 404,
            message: `Asset not found: ${assetPath}`,
        });
    }

    const fileContent = await readFile(fsPath).catch((err) => {
        throw createError({
            statusCode: 500,
            message: `Failed to read asset "${assetPath}"! Error: ${err.message}`,
        });
    });

    return fileContent;
});
