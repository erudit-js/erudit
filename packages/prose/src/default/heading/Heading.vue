<script lang="ts" setup>
import { h } from 'vue';

import type { ParsedElement } from '../../element';
import type { HeadingSchema } from '.';
import { useFormatText } from '../../app';
import ProseBlock from '../../app/front/components/ProseBlock.vue';

const { element } = defineProps<{ element: ParsedElement<HeadingSchema> }>();

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
    <ProseBlock :element class="mt-normal micro:mt-big first:mt-0">
        <component
            :is="Tag"
            :class="[
                'text-text-deep transition-[color,border]',
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
    </ProseBlock>
</template>
