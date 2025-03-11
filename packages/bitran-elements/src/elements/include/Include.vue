<script lang="ts" setup>
import { Render, type ElementProps } from '@bitran-js/renderer-vue';

import type { IncludeSchema } from './shared';

const props = defineProps<ElementProps<IncludeSchema>>();
const { blocks } = props.node.parseData;
</script>

<template>
    <div :class="$style.include">
        <Render v-if="blocks" v-for="node of blocks.children" :node />
        <div v-else>No blocks</div>
    </div>
</template>

<style lang="scss" module>
.include {
    > .bitran-blockContainer:first-of-type {
        > .bitran-blockFloat--above {
            display: none;
        }
    }

    > .bitran-blockContainer:last-of-type {
        > .bitran-blockFloat--below {
            display: none;
        }
    }
}
</style>
