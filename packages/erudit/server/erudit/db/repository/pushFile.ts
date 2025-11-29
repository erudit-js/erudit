import slash from 'slash';

export async function pushFile(filepath: string, role: string): Promise<void> {
    filepath = slash(filepath);

    if (!filepath.startsWith(ERUDIT.config.paths.project)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'File is outside of project directory!',
            message: `Can not add ${filepath} as it is outside of the project directory!`,
        });
    }

    const relativePath = filepath.replace(ERUDIT.config.paths.project, '');

    await ERUDIT.db.insert(ERUDIT.db.schema.files).values({
        path: relativePath,
        role,
    });
}
