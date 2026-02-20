import type { ProseStorage, ToProseElement } from 'tsprose';
import type { ProblemSchema } from '@erudit-js/prose/elements/problem/problem';
import type { SubProblemSchema } from '@erudit-js/prose/elements/problem/problems';
import { createProblemScriptStorage as _createProblemScriptStorage } from '@erudit-js/prose/elements/problem/storage';

export async function createProblemScriptStorage(
  element: ToProseElement<ProblemSchema> | ToProseElement<SubProblemSchema>,
  storage: ProseStorage,
) {
  if (!element.storageKey) {
    return;
  }

  const runtimeConfig = useRuntimeConfig();

  storage[element.storageKey!] = _createProblemScriptStorage(
    ERUDIT.paths.project(),
    runtimeConfig.app.baseURL,
    element.storageKey.replace('problemScript:', ''),
  );
}
