<script lang="ts" setup>
import { provide } from 'vue';
import type { AnySchema, GenericStorage, ProseElement } from '@jsprose/core';

import {
    proseContextSymbol,
    type ProseContext,
} from '../composables/context.js';
import { proseStorageSymbol } from '../composables/storage.js';
import Render from './Render.vue';
import { anchorStateSymbol, useAnchorState } from '../composables/anchor.js';

const { element, storage, context } = defineProps<{
    element: ProseElement<AnySchema>;
    storage: GenericStorage;
    context: ProseContext;
}>();

provide(proseContextSymbol, context);
provide(proseStorageSymbol, storage);

const anchorState = useAnchorState(context.hashUrl, element);
provide(anchorStateSymbol, anchorState);
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
