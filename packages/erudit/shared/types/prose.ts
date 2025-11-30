import type { AnySchema, GenericStorage, ProseElement } from '@jsprose/core';

export interface ResolvedProse {
    proseElement: ProseElement<AnySchema>;
    storage: GenericStorage;
}
