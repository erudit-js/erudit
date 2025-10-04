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

const { anchorElement, containsAnchorElements } = useAnchorState(
    context.hashId,
    element,
);
provide(anchorStateSymbol, {
    anchorElement,
    containsAnchorElements,
});
</script>

<template>
    <section
        :class="[
            /* Variables */
            `micro:[--proseAsideWidth:20px] [--proseAsideWidth:16px]
            [--proseGap:none]`,
        ]"
    >
        <Render :element />
    </section>
</template>
