import { isRawElement } from '@jsprose/core';

import { defineResolveStep } from '../../resolveStep.js';
import { problemSchema } from './problem.js';
import { subProblemSchema } from './problems.js';

export const problemScriptStep = defineResolveStep(({ rawElement }) => {
    if (
        !isRawElement(rawElement, problemSchema) &&
        !isRawElement(rawElement, subProblemSchema)
    ) {
        return;
    }

    const script = rawElement.storageKey?.replace('problemScript:', '');
    if (script) {
        return script;
    }
});
