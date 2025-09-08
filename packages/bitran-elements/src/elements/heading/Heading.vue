<script lang="ts" setup>
import {
    injectFormatText,
    useElementParseData,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import type { HeadingSchema } from './shared';

defineProps<ElementProps<HeadingSchema>>();
const { level, title } = useElementParseData<HeadingSchema>();
const formatText = injectFormatText();
</script>

<template>
    <component :is="`h${level + 1}`" :class="$style.h">
        {{ formatText(title) }}
    </component>
</template>

<style lang="scss" module>
h2,
h3,
h4 {
    &.h {
        color: var(--bitran_textDeep);
        font-weight: 700;
    }
}

h2.h {
    font-size: 1.55em;
    border-bottom: 1px solid light-dark(#dedede, #323232);
    padding-bottom: 10px;
}

h3.h {
    font-size: 1.2em;
}

h4.h {
    font-size: 1.05em;
}

// Dirty hack to add extra space before the heading
:global(.bitran-blockContainer:not(:first-of-type)):has(
    :global(> .bitran-block > .bitran-blockMain) > .h
) {
    margin-top: calc(var(--bitran_gapBlocks) * 1.25);
}
</style>
