<script lang="ts" setup>
import { useElementStorage } from '../../../app/front/composables/elementStorage';
import type { ParsedElement } from '../../../element';
import type { BlockMathSchema, MathGroup as _MathGroup } from '../block';
import ProseBlock from '../../../app/front/components/ProseBlock.vue';
import MathGroup from './MathGroup.vue';

const { element } = defineProps<{ element: ParsedElement<BlockMathSchema> }>();
const blockMathStorage = await useElementStorage<BlockMathSchema>(element);
const mathGroup: _MathGroup = blockMathStorage;
</script>

<template>
    <ProseBlock :element>
        <div :style="{ '--mathRowGap': '.6em' }">
            <MathGroup :mathGroup :freeze="element.data.freeze" />
        </div>
    </ProseBlock>
</template>
