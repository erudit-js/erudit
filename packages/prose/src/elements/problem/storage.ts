import { projectRelFilePath } from '../../shared/filePath.js';

export type ProblemScriptStorage =
    | {
          resolvedScriptSrc: string;
      }
    | undefined;

export function problemScriptStorageKey(scriptId: string): string {
    return `problemScript:${scriptId}`;
}

export function createProblemScriptStorage(
    projectAbsPath: string,
    projectBaseUrl: string,
    scriptId: string,
): ProblemScriptStorage {
    const resolvedSrc =
        projectBaseUrl +
        'api/problemScript/' +
        projectRelFilePath(projectAbsPath, scriptId) +
        '.js';
    return {
        resolvedScriptSrc: resolvedSrc,
    };
}
