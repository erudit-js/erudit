import {
    defineTag,
    Registry,
    type AnySchema,
    type ConfigurableTagProps,
    type NormalizedChildren,
    type ProcessTagFunction,
    type TagDefinition,
} from '@jsprose/core';

import type { EruditRawElement } from './rawElement.js';
import { finalizeSnippet, type ObjPropSnippet } from './snippet.js';
import { finalizeToc, type ObjPropToc } from './toc.js';
import { finalizeTitle } from './title.js';

declare const NoTocSymbol: unique symbol;
declare const NoSnippetSymbol: unique symbol;

export type NoToc = { readonly [NoTocSymbol]?: never };
export type NoSnippet = { readonly [NoSnippetSymbol]?: never };

export type EruditTagProps<TProps extends Record<string, unknown>> =
    (TProps extends NoToc ? {} : ObjPropToc) &
        (TProps extends NoSnippet ? {} : ObjPropSnippet);

export type EruditProcessTagArgs = {
    tagName: string;
    element: EruditRawElement<AnySchema>;
    props: ConfigurableTagProps & ObjPropSnippet & ObjPropToc;
    children: NormalizedChildren;
    registry: Registry;
};

export function defineEruditTag<
    const TSchema extends AnySchema,
    const TTagDefinition extends TagDefinition<TSchema>,
>(definition: TTagDefinition) {
    const baseFinalizeTag = defineTag(definition);

    function eruditFinalizeTag<
        const TConfigurableTagProps extends ConfigurableTagProps,
    >(
        processTag: ProcessTagFunction<
            TTagDefinition['schema'],
            TTagDefinition,
            TConfigurableTagProps &
                (TTagDefinition['schema']['linkable'] extends true
                    ? EruditTagProps<TConfigurableTagProps>
                    : {}),
            EruditRawElement<
                TTagDefinition['schema'],
                TTagDefinition['tagName']
            >
        >,
    ) {
        const eruditTag = baseFinalizeTag<
            TConfigurableTagProps &
                (TTagDefinition['schema']['linkable'] extends true
                    ? EruditTagProps<TConfigurableTagProps>
                    : {})
        >((args: EruditProcessTagArgs) => {
            processTag(args as any);

            // Use every possibility to get shared title property
            args.element.title = finalizeTitle(args);

            args.element.snippet = finalizeSnippet(args);
            args.element.toc = finalizeToc(args);

            // Use every possibility to get human-readable slug whether it is set manually or taken from snippet or toc
            args.element.slug ||=
                args.element.snippet?.title || args.element.toc?.title;
        });

        return eruditTag;
    }

    return eruditFinalizeTag;
}
