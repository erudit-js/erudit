import {
  defineTag,
  TAG_PREFIX,
  type NormalizedChildren,
  type Schema,
  type TagProps,
  type ValidateTagCustomProps,
} from 'tsprose';

import type { ToEruditRawElement } from './rawElement.js';
import {
  finalizeSnippet,
  NO_SNIPPET_PREFIX,
  type NoSnippet,
  type SnippetTagProp,
} from './snippet.js';
import {
  finalizeToc,
  NO_TOC_PREFIX,
  type NoToc,
  type TocTagProp,
} from './toc.js';

type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;

export type ToEruditTag<
  TSchema extends Schema,
  TagName extends string,
  Props extends Record<string, any> = {},
> = {
  [TAG_PREFIX]: true;
  tagName: TagName;
  schema: TSchema;
} & ((
  props: DistributiveOmit<
    EruditTagProps<TSchema, TagName, Props>,
    typeof NO_TOC_PREFIX | typeof NO_SNIPPET_PREFIX
  >,
) => ToEruditRawElement<TSchema, TagName>);

export type EruditTag = ToEruditTag<Schema, string, any>;

export type EruditTagProps<
  TSchema extends Schema,
  TagName extends string,
  Props extends Record<string, any> = {},
> = TagProps<TSchema, TagName, Props> & EruditTagTocSnippet<TSchema, Props>;

export type EruditTagTocSnippet<
  TSchema extends Schema,
  Props extends Record<string, any> = {},
> = TSchema['linkable'] extends false
  ? {}
  : (Props extends NoToc ? {} : TocTagProp) &
      (Props extends NoSnippet ? {} : SnippetTagProp);

export function defineEruditTag<
  TSchema extends Schema,
  TagName extends string,
>(tagParameters: { tagName: TagName; schema: TSchema }) {
  const baseFinalizeTag = defineTag(tagParameters);

  function eruditFinalizeTag<const Props extends ValidateTagCustomProps<Props>>(
    eruditTagElementHandler: EruditTagElementHandler<TagName, TSchema, Props>,
  ) {
    const eruditTag = baseFinalizeTag<Props>((baseContext) => {
      const specificContext = baseContext as EruditTagElementHandlerContext<
        TagName,
        TSchema,
        Props
      >;
      const anyContext = baseContext as EruditTagElementHandlerContext;

      // Allow specific tag to set title, snippet and toc properties first
      // Then used it for finalization processes
      eruditTagElementHandler(specificContext);

      const rawElement = anyContext.element;

      finalizeSnippet(rawElement, anyContext.props.snippet);
      finalizeToc(rawElement, anyContext.props.toc);

      // Use every possibility to get human-readable slug
      rawElement.slug ||=
        rawElement.snippet?.title ||
        rawElement.title ||
        (typeof rawElement.toc === 'string' ? rawElement.toc : undefined);
    });

    return eruditTag as unknown as ToEruditTag<TSchema, TagName, Props>;
  }

  return eruditFinalizeTag;
}

export type EruditTagElementHandlerContext<
  TagName extends string = string,
  TSchema extends Schema = Schema,
  Props extends Record<string, any> = {},
> = {
  tagName: TagName;
  props: EruditTagProps<TSchema, TagName, Props>;
  children: NormalizedChildren;
  element: ToEruditRawElement<TSchema, TagName>;
};

export type EruditTagElementHandler<
  TagName extends string,
  TSchema extends Schema,
  Props extends Record<string, any>,
> = (context: EruditTagElementHandlerContext<TagName, TSchema, Props>) => void;
