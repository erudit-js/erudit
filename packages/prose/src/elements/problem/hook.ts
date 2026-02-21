import { isRawElement } from 'tsprose';

import { defineRawToProseHook } from '../../rawToProse/hook.js';
import { problemSchema } from './problem.js';
import { subProblemSchema } from './problems.js';

export const problemScriptHook = defineRawToProseHook(({ result }) => {
  return {
    step: ({ rawElement }) => {
      if (
        isRawElement(rawElement, problemSchema) ||
        isRawElement(rawElement, subProblemSchema)
      ) {
        const problemScriptSrc = rawElement.storageKey?.replace(
          'problemScript:',
          '',
        );
        if (problemScriptSrc) {
          result.problemScripts.add(problemScriptSrc);
        }
      }
    },
  };
});
