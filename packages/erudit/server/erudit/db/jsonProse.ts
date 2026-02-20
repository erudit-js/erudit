import { customType } from 'drizzle-orm/sqlite-core';
import { toJSON, fromJSON } from 'tsprose';

export const jsonProse = customType<{ data: any }>({
  dataType() {
    return 'text';
  },

  toDriver(value) {
    return toJSON(value, 2);
  },

  fromDriver(value) {
    if (typeof value !== 'string') return value;
    return fromJSON(value);
  },
});
