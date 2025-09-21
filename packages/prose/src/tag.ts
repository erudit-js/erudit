import { normalizeChildren, type NormalizedChildren } from './children';
import type { JsxElement } from './element';
import { ProseError } from './error';
import { hash } from './hash';
import { type JsxAllProps, type JsxTagProps } from './props';
import type { ElementSchemaAny } from './schema';
import type { JsxElementSnippet } from './snippet';
import { ElementType } from './type';

export const ElementTagSymbol = Symbol('ElementTag');

export type ElementTag<
    TSchema extends ElementSchemaAny,
    TTagName extends string,
    TProps extends any,
> = ((props: TProps) => JsxElement<TSchema, TTagName>) & {
    [ElementTagSymbol]: undefined;
    tagName: TTagName;
    isTagElement(element: any): element is JsxElement<TSchema, TTagName>;
};

export type ElementTagAny = ElementTag<ElementSchemaAny, string, any>;

export function isTag(tag: any): tag is ElementTagAny {
    return tag && ElementTagSymbol in tag;
}

export function defineTag<TTagName extends string>(tagName: TTagName) {
    type TagSelf<TSchema extends ElementSchemaAny> = ElementTag<
        TSchema,
        TTagName,
        any
    >;

    function finalizeTag<
        TSchema extends ElementSchemaAny,
        TProps extends JsxTagProps<TSchema, TagSelf<TSchema>> &
            Record<string, any> = JsxTagProps<TSchema, TagSelf<TSchema>>,
    >(definition: {
        type: TSchema['Type'];
        name: TSchema['Name'];
        linkable: TSchema['Linkable'];
        fillElement(args: {
            tagName: TTagName;
            props: TProps;
            children: NormalizedChildren;
        }): {
            data: TSchema['Data'];
            children: TSchema['Children'] extends readonly ElementSchemaAny[]
                ? JsxElement<TSchema['Children'][number]>[]
                : undefined;
        };
        childStep?: (args: {
            tagName: TTagName;
            child: JsxElement<ElementSchemaAny>;
        }) => void;
    }): ElementTag<
        TSchema,
        TTagName,
        JsxTagProps<TSchema, TagSelf<TSchema>> & TProps
    > {
        const tag = (
            props: JsxTagProps<TSchema, TagSelf<TSchema>> & TProps,
        ) => {
            const allProps = props as JsxAllProps;

            const normalizedChildren = normalizeChildren(props, (child) => {
                if (
                    definition.type === ElementType.Inliner &&
                    child.type === ElementType.Block
                ) {
                    throw new ProseError(
                        `Inliner <${tagName}> cannot have block child <${child.tagName}>!`,
                    );
                }

                definition.childStep?.({ tagName, child });
            });

            const { data, children } = definition.fillElement({
                tagName,
                props,
                children: normalizedChildren,
            });

            const element = (<JsxElement<TSchema, TTagName>>{
                type: definition.type,
                name: definition.name,
                tagName,
                hash: hashElement(data, children),
                slug: allProps.$?.slug,
                data,
                children: children as any,
            }) as JsxElement<TSchema, TTagName>;

            if (definition.linkable) {
                element.linkable = true;
            }

            const snippet = tryCreateSnippet(allProps, element);
            if (snippet) {
                element.snippet = snippet;
            }

            if (allProps.$) {
                element.uniqueId = allProps.$.id;
                // @ts-expect-error Bypass readonly
                allProps.$.element = element;
            }

            return element;
        };

        Object.defineProperties(tag, {
            [ElementTagSymbol]: { value: undefined },
            tagName: { value: tagName },
            isTagElement: {
                value: (
                    element: any,
                ): element is JsxElement<TSchema, TTagName> =>
                    element && element.tagName === tagName,
            },
        });

        return tag as any;
    }

    return finalizeTag;
}

function hashElement(data: any, children: JsxElement<any>[] | undefined) {
    const strData = JSON.stringify(data) ?? '<undefined-data>';

    const childrenHashes = children
        ? children.map((c) => c.hash).join('|')
        : '<no-children>';

    return hash(strData + childrenHashes, 12);
}

function tryCreateSnippet(
    props: JsxAllProps,
    element: JsxElement<ElementSchemaAny>,
): JsxElementSnippet | undefined {
    if (!props.$snippet) {
        return undefined;
    }

    if (!props.$snippet.quick && !props.$snippet.search) {
        throw new ProseError(
            `Unable to create unused snippet for <${element.tagName}>: "quick" or "search" must be true!`,
        );
    }

    let rawTitle = props.$snippet?.title || element.data?.title;

    if (!rawTitle) {
        throw new ProseError(
            `Unable to get snipped title for <${element.tagName}>!`,
        );
    }

    const title = String(rawTitle);

    return {
        title,
        description: props.$snippet?.description || element.data?.description,
        quick: Boolean(props.$snippet?.quick),
        search: Boolean(props.$snippet?.search),
        synonyms:
            typeof props.$snippet?.search === 'object'
                ? props.$snippet?.search.synonyms
                : undefined,
    };
}
