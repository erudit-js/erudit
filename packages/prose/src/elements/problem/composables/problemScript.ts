import type { Unique } from 'tsprose';

import type { ProblemScriptInstance } from '../problemScript.js';

export async function createProblemScriptInstance(
  scriptUrl?: string,
  scriptUniques?: Record<string, Unique>,
): Promise<ProblemScriptInstance | undefined> {
  if (!scriptUrl || !scriptUniques) {
    return;
  }

  const problemScriptModule = await import(/* @vite-ignore */ scriptUrl);
  const problemScript = problemScriptModule.default;
  return problemScript(scriptUniques);
}
