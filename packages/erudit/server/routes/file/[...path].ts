import { existsSync } from 'node:fs';

import { serveStaticFile } from '#layers/erudit/server/erudit/staticFile';

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path;
  const fullPath = decodeURIComponent(ERUDIT.paths.project(path!));

  if (!existsSync(fullPath)) {
    throw createError({
      statusCode: 404,
      statusMessage: `File is missing!`,
      message: `Failed to find file at "${path}"!`,
    });
  }

  return serveStaticFile(event, fullPath);
});
