<script lang="ts" setup>
import { type ElementProps } from '@bitran-js/renderer-vue';

import { type BlockMathSchema } from '../shared';
import BlockMathGroup from './BlockMathGroup.vue';

const props = defineProps<ElementProps<BlockMathSchema>>();
const rootMathGroup = props.node.renderData;
</script>

<template>
    <div>
        <BlockMathGroup :group="rootMathGroup" :freeze="node.meta.freeze" />
    </div>
</template>

<style lang="scss" module>
// .blockMath {
//
// }
</style>
