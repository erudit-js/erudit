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
            'accent' in meta ? $style.accent : undefined,
            type === 'bold' ? $style.bold : $style.italic,
            ...(meta.classes || []),
        ]"
    >
        <Render :node="inliners" />
    </em>
</template>

<style lang="scss" module>
.em {
    font-style: inherit;
}

.bold {
    font-weight: 530;
    color: var(--bitran_textDeep);
}

.italic {
    font-style: italic;
}

.accent {
    color: var(--accentColor_text, inherit);
}
</style>
