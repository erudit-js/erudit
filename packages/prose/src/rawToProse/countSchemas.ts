import { isIncludedRawElement } from '../include.js';
import { defineRawToProseHook } from './hook.js';

export const countSchemasHook = defineRawToProseHook(({ result }) => {
  return {
    step({ rawElement }) {
      if (isIncludedRawElement(rawElement)) {
        return;
      }

      const schemaName = rawElement.schema.name;
      result.schemaCounts[schemaName] =
        (result.schemaCounts[schemaName] || 0) + 1;
    },
  };
});
