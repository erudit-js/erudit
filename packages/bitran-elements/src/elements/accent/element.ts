import { defineBitranElement } from '@erudit-js/cog/schema';

import { type AccentSchema, type AccentProvide } from './shared';
import type { AccentRenderArg } from './renderer';

export const defineAccentElement = (arg: {
    getTranspilerData: () => Promise<AccentProvide>;
    getRenderData: () => Promise<AccentRenderArg>;
}) =>
    defineBitranElement<AccentSchema>({
        async transpiler() {
            const { defineAccentTranspiler } = await import('./transpiler');
            const transpilerData = await arg.getTranspilerData();
            return defineAccentTranspiler({
                objName: transpilerData.objName,
            });
        },
        async renderer() {
            const { defineAccentRenderer } = await import('./renderer');
            const renderData = await arg.getRenderData();
            return defineAccentRenderer(renderData);
        },
    });
