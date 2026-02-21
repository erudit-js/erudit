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
  scriptRelSrc: string,
): ProblemScriptStorage {
  const resolvedSrc =
    projectBaseUrl +
    'api/problemScript/' +
    scriptRelSrc.replace('.tsx', '') +
    '.js';
  return {
    resolvedScriptSrc: resolvedSrc,
  };
}
