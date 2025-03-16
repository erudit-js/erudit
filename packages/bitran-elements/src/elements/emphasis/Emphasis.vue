<script lang="ts" setup>
import {
    type ElementProps,
    Render,
    useElementParseData,
} from '@bitran-js/renderer-vue';

import type { EmphasisSchema } from './shared';

defineProps<ElementProps<EmphasisSchema>>();
const { type, inliners } = useElementParseData<EmphasisSchema>();
</script>

<template>
    <em :class="[$style.em, type === 'bold' ? $style.bold : $style.italic]">
        <Render :node="inliners" />
    </em>
</template>

<style lang="scss" module>
.em {
    font-weight: normal;
    font-style: normal;
    color: var(--bitran_textDeep);
}

.bold {
    font-weight: 550;
}

.italic {
    font-style: italic;
}
</style>
