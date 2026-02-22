import { sn } from 'unslash';

export async function pushProblemScript(
  problemScriptSrc: string,
  contentFullId: string,
): Promise<void> {
  problemScriptSrc = sn(problemScriptSrc);

  let relativePath: string;

  if (problemScriptSrc.startsWith(ERUDIT.paths.project() + '/')) {
    // Absolute path inside the project – convert to relative
    relativePath = problemScriptSrc.slice(ERUDIT.paths.project().length + 1);
  } else if (/^([A-Za-z]:\/|\/)/.test(problemScriptSrc)) {
    // Absolute path outside the project – reject
    throw createError({
      statusCode: 400,
      statusMessage: 'Problem script is outside of project directory!',
      message: `Can not add problem script from ${problemScriptSrc} as it is outside of the project directory!`,
    });
  } else {
    // Already a project-relative path
    relativePath = problemScriptSrc;
  }

  await ERUDIT.db.insert(ERUDIT.db.schema.problemScripts).values({
    problemScriptSrc: relativePath,
    contentFullId,
  });
}
