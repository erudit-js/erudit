<script lang="ts" setup>
import { provide } from 'vue';

import type { ParsedElement } from '../../../element';
import {
    proseContextSymbol,
    type ProseAppContext,
} from '../composables/appContext';
import type { ElementSchemaAny } from '../../../schema';
import { anchorStateSymbol, useAnchorState } from '../composables/anchor';
import Render from './Render.vue';

const { element, context } = defineProps<{
    element: ParsedElement<ElementSchemaAny>;
    context: ProseAppContext;
}>();
provide(proseContextSymbol, { ...context });

const anchorState = useAnchorState(context.hashId, element);
provide(anchorStateSymbol, anchorState);
</script>

<template>
    <section
        :class="[
            /* Variables */
            `micro:[--proseAsideWidth:20px] [--proseGap:none]1
            [--proseAsideWidth:16px]`,
        ]"
    >
        <Render :element />
    </section>
</template>
