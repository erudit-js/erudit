import { parseProblemScriptId } from '@erudit-js/prose/elements/problem/problemScript';

export async function pushProblemScript(
    problemScriptId: string,
    contentFullId: string,
): Promise<void> {
    const parsedId = parseProblemScriptId(problemScriptId);

    if (!parsedId.scriptSrc.startsWith(ERUDIT.config.paths.project)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Problem script is outside of project directory!',
            message: `Can not add problem script from ${parsedId.scriptSrc} as it is outside of the project directory!`,
        });
    }

    await ERUDIT.db.insert(ERUDIT.db.schema.problemScripts).values({
        problemScriptId,
        contentFullId,
    });
}
