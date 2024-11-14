import {
    defineBitranElement,
    type BitranElements,
} from '@erudit/globals/bitran';

// Erudit Default Elements
import {
    aliasesName,
    type AliasesSchema,
} from '@erudit-js/bitran-elements/aliases/shared';
import { aliasesTranspiler } from '@erudit-js/bitran-elements/aliases/transpiler';
import { aliasesRenderer } from '@erudit-js/bitran-elements/aliases/renderer';
import {
    includeName,
    type IncludeSchema,
} from '@erudit-js/bitran-elements/include/shared';
import { includeTranspiler } from '@erudit-js/bitran-elements/include/transpiler';
import { includeRenderer } from '@erudit-js/bitran-elements/include/renderer';
import {
    headingName,
    type HeadingSchema,
} from '@erudit-js/bitran-elements/heading/shared';
import { headingTranspiler } from '@erudit-js/bitran-elements/heading/transpiler';
import { headingRenderer } from '@erudit-js/bitran-elements/heading/renderer';
import { linkName, type LinkSchema } from '@erudit/shared/bitran/link/shared';
import { linkTranspiler } from '@erudit/shared/bitran/link/transpiler';
import { linkRenderer } from '@erudit/shared/bitran/link/renderer';

export const defaultElements: BitranElements = {
    [aliasesName]: defineBitranElement<AliasesSchema>({
        transpiler: async () => aliasesTranspiler,
        renderer: async () => aliasesRenderer,
    }),
    [includeName]: defineBitranElement<IncludeSchema>({
        transpiler: async () => includeTranspiler,
        renderer: async () => includeRenderer,
    }),
    [headingName]: defineBitranElement<HeadingSchema>({
        transpiler: async () => headingTranspiler,
        renderer: async () => headingRenderer,
    }),
    [linkName]: defineBitranElement<LinkSchema>({
        transpiler: async () => linkTranspiler,
        renderer: async () => linkRenderer,
    }),
};
