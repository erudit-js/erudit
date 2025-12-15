import type { AnySchema, GenericStorage, ProseElement } from '@jsprose/core';

export interface FinalizedProse {
    proseElement: ProseElement<AnySchema>;
    storage: GenericStorage;
}
