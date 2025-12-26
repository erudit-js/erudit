export async function pushProblemScript(
    problemScriptSrc: string,
    contentFullId: string,
): Promise<void> {
    const parsedId = problemScriptSrc;

    if (!problemScriptSrc.startsWith(ERUDIT.config.paths.project)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Problem script is outside of project directory!',
            message: `Can not add problem script from ${problemScriptSrc} as it is outside of the project directory!`,
        });
    }

    await ERUDIT.db.insert(ERUDIT.db.schema.problemScripts).values({
        problemScriptSrc,
        contentFullId,
    });
}
