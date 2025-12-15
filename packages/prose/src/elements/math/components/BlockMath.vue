<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import type { blockMathSchema, MathGroup as _MathGroup } from '../block.js';
import { useElementStorage } from '../../../app/composables/storage.js';
import MathGroup from './MathGroup.vue';
import Block from '../../../app/shared/block/Block.vue';

const { element } = defineProps<{
    element: ProseElement<typeof blockMathSchema>;
}>();
const blockMathStorage =
    await useElementStorage<typeof blockMathSchema>(element);
const mathGroup: _MathGroup = blockMathStorage;
</script>

<template>
    <Block :element>
        <div :style="{ '--mathRowGap': '.6em' }">
            <MathGroup :mathGroup :freeze="Boolean(element.data.freeze)" />
        </div>
    </Block>
</template>
