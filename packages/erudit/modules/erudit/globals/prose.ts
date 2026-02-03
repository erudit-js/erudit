import type { AnySchema, RawElement } from '@jsprose/core';

export { defineDocument as defineProse } from '@jsprose/core';

export type AnyProseElement = RawElement<AnySchema>;
