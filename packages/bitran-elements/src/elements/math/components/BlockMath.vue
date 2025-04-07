<script lang="ts" setup>
import {
    useElementRenderData,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import { type BlockMathSchema } from '../shared';
import BlockMathGroup from './BlockMathGroup.vue';

defineProps<ElementProps<BlockMathSchema>>();
const rootMathGroup = useElementRenderData<BlockMathSchema>();
</script>

<template>
    <div>
        <BlockMathGroup :group="rootMathGroup" :freeze="node.meta.freeze" />
    </div>
</template>
