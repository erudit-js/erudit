import { sn } from 'unslash';

export async function pushFile(filepath: string, role: string): Promise<void> {
  filepath = sn(filepath);

  let relativePath: string;

  if (filepath.startsWith(ERUDIT.paths.project() + '/')) {
    // Absolute path inside the project – convert to relative
    relativePath = filepath.slice(ERUDIT.paths.project().length + 1);
  } else if (/^([A-Za-z]:\/|\/)/.test(filepath)) {
    // Absolute path outside the project – reject
    throw createError({
      statusCode: 400,
      statusMessage: 'File is outside of project directory!',
      message: `Can not add ${filepath} as it is outside of the project directory!`,
    });
  } else {
    // Already a project-relative path
    relativePath = filepath;
  }

  await ERUDIT.db
    .insert(ERUDIT.db.schema.files)
    .values({
      path: relativePath,
      role,
    })
    .onConflictDoNothing();
}
