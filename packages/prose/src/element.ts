import type {
    BlockSchemaAny,
    ElementSchemaAny,
    InlinerSchemaAny,
} from './schema';
import type { JsxSnippet } from './snippet';

type ConstructElementKind<TSchema extends ElementSchemaAny, TProperties> = {
    type: TSchema['Type'];
    name: TSchema['Name'];
    storageKey: string | undefined;
    data: TSchema['Data'];
    children: TSchema['Children'] extends ElementSchemaAny[]
        ? ConstructElementKind<
              TSchema['Children'][number],
              Omit<TProperties, 'tagName'> & { tagName: string }
          >[]
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
        linkable: true | undefined;
        uniqueId: string | undefined;
        snippet: JsxSnippet | undefined;
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

export function isBlockElement(
    element: any,
): element is JsxElement<BlockSchemaAny> {
    return element && element?.type === 'block';
}

export function isInlinerElement(
    element: any,
): element is JsxElement<InlinerSchemaAny> {
    return element && element?.type === 'inliner';
}
