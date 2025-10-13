import type {
    BlockSchemaAny,
    ElementSchemaAny,
    InlinerSchemaAny,
} from './schema';
import type { JsxSnippet } from './snippet';

type ConstructElementKind<TSchema extends ElementSchemaAny, TProperties> = {
    type: TSchema['Type'];
    name: TSchema['Name'];
    title?: string;
    uniqueSlug?: string;
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
        /**
         * The slug is a URL-friendly version of the element's title.
         *
         * Not to be confused with `uniqueSlug`, which holds a name of document-global uniqueness.
         */
        slug?: string;
        linkable: true | undefined;
        snippet: JsxSnippet | undefined;
    }
>;

export type ParsedElement<TSchema extends ElementSchemaAny> =
    ConstructElementKind<
        TSchema,
        {
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
