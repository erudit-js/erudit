import type { ToProseElement } from 'tsprose';
import type { ProblemSchema } from '@erudit-js/prose/elements/problem/problem';
import type { SubProblemSchema } from '@erudit-js/prose/elements/problem/problems';
import { createProblemScriptStorage as _createProblemScriptStorage } from '@erudit-js/prose/elements/problem/storage';

export function createProblemScriptStorage(
  element: ToProseElement<ProblemSchema> | ToProseElement<SubProblemSchema>,
  storageKey: string,
) {
  const runtimeConfig = useRuntimeConfig();

  return _createProblemScriptStorage(
    ERUDIT.paths.project(),
    runtimeConfig.app.baseURL,
    storageKey.replace('problemScript:', ''),
  );
}
