import { normalizeChildren, type NormalizedChildren } from './children';
import type { JsxElement } from './element';
import { ProseError } from './error';
import { hash } from './hash';
import { type JsxAllProps, type JsxTagProps } from './props';
import type { ElementSchemaAny } from './schema';
import type { JsxSnippet } from './snippet';
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
        initElement: (args: {
            tagName: TTagName;
            element: JsxElement<TSchema, TTagName>;
            props: JsxTagProps<TSchema, TagSelf<TSchema>> & TProps;
            children: NormalizedChildren;
        }) => void;
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

            const element = <JsxElement<TSchema, TTagName>>{
                type: definition.type,
                name: definition.name,
                tagName,
                slug: allProps.$?.slug,
            };

            if (definition.linkable) {
                element.linkable = true;
            }

            if (allProps.$) {
                element.uniqueSlug = allProps.$.slug;
                // @ts-expect-error Bypass readonly
                allProps.$.element = element;
            }

            definition.initElement({
                tagName,
                element,
                props,
                children: normalizedChildren,
            });

            const snippet = tryCreateSnippet(allProps, element);
            if (snippet) {
                element.snippet = snippet;
            }

            element.hash = hashElement(
                element.name,
                element.data,
                normalizedChildren,
            );

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

function hashElement(
    name: string,
    data: any,
    children: JsxElement<any>[] | undefined,
) {
    const strData = JSON.stringify(data) ?? '<undefined-data>';

    const childrenHashes = children
        ? children.map((c) => c.hash).join('|')
        : '<no-children>';

    return hash(name + strData + childrenHashes, 12);
}

function tryCreateSnippet(
    props: JsxAllProps,
    element: JsxElement<ElementSchemaAny>,
): JsxSnippet | undefined {
    if (!props.$snippet && !element.snippet) {
        return undefined;
    }

    const rawSearch = element.snippet?.search ?? props.$snippet?.search;
    const rawQuick = element.snippet?.quick ?? props.$snippet?.quick;

    if (rawSearch === undefined && rawQuick === undefined) {
        throw new ProseError(
            `Unable to create unused snippet for <${element.tagName}>: "quick" or "search" must be defined!`,
        );
    }

    let rawTitle =
        element.snippet?.title || props.$snippet?.title || element.data?.title;

    if (!rawTitle) {
        throw new ProseError(
            `Unable to get snipped title for <${element.tagName}>!`,
        );
    }

    const title = String(rawTitle);

    const description =
        element.snippet?.description ||
        props.$snippet?.description ||
        element.data?.description;

    const synonyms =
        element.snippet?.synonyms ||
        (typeof props.$snippet?.search === 'object' && props.$snippet?.search
            ? props.$snippet?.search.synonyms
            : undefined);

    return {
        title,
        description,
        quick: Boolean(rawQuick),
        search: Boolean(rawSearch),
        synonyms,
    };
}
