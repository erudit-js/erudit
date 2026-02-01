import type { GenericStorage, ProseElement } from '@jsprose/core';
import type { problemSchema } from '@erudit-js/prose/elements/problem/problem';
import type { subProblemSchema } from '@erudit-js/prose/elements/problem/problems';
import { createProblemScriptStorage as _createProblemScriptStorage } from '@erudit-js/prose/elements/problem/storage';

export async function createProblemScriptStorage(
    element:
        | ProseElement<typeof problemSchema>
        | ProseElement<typeof subProblemSchema>,
    storage: GenericStorage,
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
