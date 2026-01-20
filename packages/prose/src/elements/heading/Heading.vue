<script lang="ts" setup>
import { h } from 'vue';
import type { ProseElement } from '@jsprose/core';

import { useFormatText } from '../../app/composables/formatText.js';
import type { headingSchema } from './core.js';
import Block from '../../app/shared/block/Block.vue';

const { element } = defineProps<{
    element: ProseElement<typeof headingSchema>;
}>();

const formatText = useFormatText();

const Tag = (() => {
    switch (element.data.level) {
        case 1:
            return h('h2');
        case 2:
            return h('h3');
        case 3:
            return h('h4');
    }
})();
</script>

<template>
    <Block :element class="mt-normal micro:mt-big first:mt-0">
        <component
            :is="Tag"
            :class="[
                'text-text-deep',
                {
                    [`text-main-2xl border-border pb-small micro:pb-normal
                    border-b font-bold`]: element.data.level === 1,
                    'text-main-xl font-semibold': element.data.level === 2,
                    'text-main-lg font-medium': element.data.level === 3,
                },
            ]"
        >
            {{ formatText(element.data.title) }}
        </component>
    </Block>
</template>
