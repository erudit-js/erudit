<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue';

import proseStyle from '../styles/prose.module.css';

const blockElement = useTemplateRef('block');
const focus = ref(false);

onMounted(() => {
    blockElement.value?.addEventListener('mouseenter', () => {
        focus.value = true;
    });

    blockElement.value?.addEventListener('mouseleave', () => {
        focus.value = false;
    });
});
</script>

<template>
    <div
        ref="block"
        :class="[
            proseStyle.block,
            focus && proseStyle.blockFocus,
            'pr-(--proseGap) pl-[calc(var(--proseGap)-var(--proseAsideWidth))]',
        ]"
    >
        <div :class="[proseStyle.blockAbove, 'h-(--proseGap)']"></div>

        <div class="relative">
            <div
                :class="[
                    proseStyle.blockAside,
                    'absolute top-0 left-0 h-full w-(--proseAsideWidth)',
                ]"
            >
                <div
                    :class="[
                        proseStyle.blockAsideBg,
                        'micro:rounded absolute top-0 left-0 h-full w-full transition-[background]',
                    ]"
                ></div>
            </div>
            <div class="pl-(--proseAsideWidth)">
                <slot></slot>
            </div>
        </div>

        <div :class="[proseStyle.blockBelow, 'h-(--proseGap)']"></div>
    </div>
</template>
