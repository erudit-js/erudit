import {
    defineComponent,
    defineElementVueRenderer,
    type ElementVueRenderer,
} from '@bitran-js/renderer-vue';

import { AccentNode, type AccentRenderData, type AccentSchema } from './shared';

export type AccentRenderArg = {
    icon: ElementVueRenderer['icon'];
    languages: ElementVueRenderer['languages'];
} & AccentRenderData;

export function defineAccentRenderer(
    accentRenderArg: AccentRenderArg,
): ElementVueRenderer<AccentSchema> {
    return defineElementVueRenderer<AccentSchema>({
        Node: AccentNode,
        component: defineComponent(() => import('./components/Accent.vue')),
        icon: accentRenderArg.icon,
        languages: accentRenderArg.languages,
        async createRenderData() {
            return {
                ...accentRenderArg,
            };
        },
    });
}
