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
    <div :class="$style.blockMath">
        <BlockMathGroup :group="rootMathGroup" :freeze="node.meta.freeze" />
    </div>
</template>

<style lang="scss" module>
@use '../../../shared/utils' as elementUtils;

.blockMath {
    @include elementUtils.scrollbar($x: auto, $y: hidden);
}
</style>