import type { AnyUnique } from '@jsprose/core';

import type { ProblemScriptInstance } from '../problemScript.js';

export async function createProblemScriptInstance(
  scriptUrl?: string,
  scriptUniques?: Record<string, AnyUnique>,
): Promise<ProblemScriptInstance | undefined> {
  if (!scriptUrl || !scriptUniques) {
    return;
  }

  const problemScriptModule = await import(/* @vite-ignore */ scriptUrl);
  const problemScript = problemScriptModule.default;
  return problemScript(scriptUniques);
}
