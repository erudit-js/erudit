<script lang="ts" setup>
import { provide } from 'vue';

import type { AppElementDefinition } from '../../../app/appElement';
import type { BlocksSchema } from '../../../default/blocks/index';
import type { ParsedElement } from '../../../element';
import { proseContextSymbol } from '../composables/prose';
import type { GenericStorage } from '../../../storage';
import Render from './Render.vue';

const { storage, appElements } = defineProps<{
    root: ParsedElement<BlocksSchema>;
    storage: GenericStorage;
    appElements: Record<string, AppElementDefinition>;
}>();

provide(proseContextSymbol, {
    storage,
    appElements,
});
</script>

<template>
    <section
        :class="[
            `micro:[--proseAsideWidth:20px] [--proseAsideWidth:12px]
            [--proseGap:none]`,
            '',
        ]"
    >
        <Render :element="root" />
    </section>
</template>
