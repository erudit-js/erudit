import type { RawChildren } from './children';
import type { ElementSchemaAny } from './schema';
import type { JsxPropsSnippet } from './snippet';
import type { ElementTagAny } from './tag';
import type { ElementUnique } from './unique';

export type JsxUniversalProps = {
    children?: RawChildren;
};

export type JsxLinkableProps<TTag extends ElementTagAny> = {
    /** Mark this element as important and unique:
     * - Easy reuse
     * - Reference in links
     * - Nice readable ID
     */
    $?: ElementUnique<TTag>;
    /** Short element information used in search and quick links. */
    $snippet?: JsxPropsSnippet;
};

export type JsxTagProps<
    TSchema extends ElementSchemaAny,
    TTag extends ElementTagAny,
> = JsxUniversalProps &
    (TSchema['Linkable'] extends true ? JsxLinkableProps<TTag> : {});

export type JsxAllProps = JsxUniversalProps & JsxLinkableProps<ElementTagAny>;
