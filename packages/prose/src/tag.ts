import { normalizeChildren, type NormalizedChildren } from './children';
import type { JsxElement } from './element';
import { ProseError } from './error';
import { hash } from './hash';
import { PropsMode, type JsxGlobalProps, type ModeProps } from './props';
import type { ElementSchemaAny } from './schema';
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

export function defineTag<
    TTagName extends string,
    TPropsMode extends PropsMode,
>(tagName: TTagName, _mode: TPropsMode) {
    function finalizeTag<
        TSchema extends ElementSchemaAny,
        TProps extends TPropsMode extends PropsMode.Default
            ? never
            : TPropsMode extends PropsMode.Mixed
              ? Partial<JsxGlobalProps<any>> &
                    Omit<Record<string, any>, keyof JsxGlobalProps<any>>
              : Record<string, any>,
    >(definition: {
        type: TSchema['Type'];
        name: TSchema['Name'];
        dataChildren(args: {
            tagName: TTagName;
            props: ModeProps<TSchema, TTagName, TPropsMode, TProps>;
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
        ModeProps<TSchema, TTagName, TPropsMode, TProps>
    > {
        const tag = (
            props: ModeProps<TSchema, TTagName, TPropsMode, TProps>,
        ) => {
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

            const { data, children } = definition.dataChildren({
                tagName,
                props,
                children: normalizedChildren,
            });

            const element: JsxElement<TSchema, TTagName> = {
                type: definition.type,
                name: definition.name,
                tagName,
                hash: hashElement(data, children),
                uniqueId: undefined,
                slug: props.$?.slug,
                data,
                children: children as any,
            };

            if (props.$) {
                element.uniqueId = props.$.id;
                props.$.element = element;
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
