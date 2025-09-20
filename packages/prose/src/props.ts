import type { RawChildren } from './children';
import type { ElementSchemaAny } from './schema';
import type { ElementTag, ElementTagAny } from './tag';
import type { ElementUnique } from './unique';

export type JsxSnippet = {
    title?: string;
    description?: string;
    quick?: true;
    search?: true | { synonyms?: string[] };
};

export interface JsxGlobalProps<TTag extends ElementTagAny> {
    children?: RawChildren;
    /**
     * Mark this element as important and unique:
     * - Easy reuse
     * - Reference in links
     * - Nice readable ID
     */
    $?: ElementUnique<TTag>;
    /** Short element information used in search and quick links. */
    $snippet?: JsxSnippet;
}

export enum PropsMode {
    Default,
    Mixed,
    Custom,
}

export type ModeProps<
    TSchema extends ElementSchemaAny,
    TTagName extends string,
    TMode extends PropsMode,
    TCustomProps extends Record<string, any>,
> = TMode extends PropsMode.Default
    ? JsxGlobalProps<ElementTag<TSchema, TTagName, any>>
    : TMode extends PropsMode.Mixed
      ? JsxGlobalProps<ElementTag<TSchema, TTagName, any>> & TCustomProps
      : TCustomProps;
