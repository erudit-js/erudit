import type {
    ParsedElement,
    GenericStorage,
    ElementSchemaAny,
} from '@erudit-js/prose';

export interface ResolvedProse<
    TSchema extends ElementSchemaAny = ElementSchemaAny,
> {
    element: ParsedElement<TSchema>;
    zippedStorage: string;
}
