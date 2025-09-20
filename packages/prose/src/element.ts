import type { ElementSchemaAny } from './schema';

type ConstructElementKind<TSchema extends ElementSchemaAny, TProperties> = {
    type: TSchema['Type'];
    name: TSchema['Name'];
    data: TSchema['Data'];
    children: TSchema['Children'] extends ElementSchemaAny[]
        ? ConstructElementKind<TSchema['Children'][number], TProperties>[]
        : undefined;
} & TProperties;

export type JsxElement<
    TSchema extends ElementSchemaAny,
    TTagName extends string = string,
> = ConstructElementKind<
    TSchema,
    {
        hash: string;
        tagName: TTagName;
        slug: string | undefined;
        uniqueId: string | undefined;
        /* Snipped data? */
    }
>;

export type ParsedElement<TSchema extends ElementSchemaAny> =
    ConstructElementKind<
        TSchema,
        {
            uniqueId: string | undefined;
            domId: string | undefined;
        }
    >;

export type ResolvedElement<TSchema extends ElementSchemaAny> =
    ConstructElementKind<
        TSchema,
        {
            storageKey: string | undefined;
            storageData: TSchema['Storage'] | undefined;
            uid: string | undefined;
        }
    >;

export function isBlockElement(element: any): boolean {
    return element && element?.type === 'block';
}

export function isInlinerElement(element: any): boolean {
    return element && element?.type === 'inliner';
}
