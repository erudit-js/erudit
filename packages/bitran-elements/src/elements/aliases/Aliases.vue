<script lang="ts" setup>
import type { ElementProps } from '@bitran-js/renderer-vue';

import type { AliasesSchema } from './shared';
import arrowRight from './arrow-right.svg?raw';

defineProps<ElementProps<AliasesSchema>>();

function selectAllOnClick(event: Event) {
    const input = event.target as HTMLInputElement;
    input.select();
}
</script>

<template>
    <div :class="$style.aliases">
        <div v-for="(target, alias) of node.parseData" :class="$style.record">
            <input
                type="text"
                :value="'~' + alias"
                readonly
                @click="selectAllOnClick"
            />
            <svg :class="$style.arrow" v-html="arrowRight"></svg>
            <input
                type="text"
                :value="target"
                readonly
                @click="selectAllOnClick"
            />
        </div>
    </div>
</template>

<style lang="scss" module>
.aliases {
    display: flex;
    flex-direction: column;
    gap: 10px;

    background: light-dark(#f1f1f1, #1b1b1b);
    border-radius: 5px;
    padding: 10px;
    border: 2px dashed light-dark(#d7d7d7, #333);

    .record {
        display: flex;
        align-items: center;
        gap: 10px;

        input {
            flex: 1;
            border: none;
            border-radius: 5px;
            background: light-dark(white, #262626);
            font-family: monospace;
            font-size: 0.9em;
            color: var(--bitran_text);
            padding: 3px 6px;
            min-width: 0;
        }

        .arrow {
            height: 1em;
            width: 1em;
            color: var(--bitran_textMuted);
            fill: currentColor;
        }
    }
}
</style>
