<script lang="ts" setup>
import {
    type ElementProps,
    Render,
    useElementMeta,
    useElementParseData,
} from '@bitran-js/renderer-vue';

import type { EmphasisSchema } from './shared';

defineProps<ElementProps<EmphasisSchema>>();
const meta = useElementMeta<EmphasisSchema>();
const { type, inliners } = useElementParseData<EmphasisSchema>();
</script>

<template>
    <em
        :class="[
            $style.em,
            type === 'bold' ? $style.bold : $style.italic,
            ...(meta.classes || []),
        ]"
    >
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
    font-weight: 530;
}

.italic {
    font-style: italic;
}
</style>
