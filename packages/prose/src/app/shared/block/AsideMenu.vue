<script setup lang="ts">
import { computed } from 'vue';
import type { AnySchema, ProseElement } from '@jsprose/core';

import { useElementPhrase } from '../../composables/language.js';
import AsideMenuSeparator from './AsideMenuSeparator.vue';
import AsideMenuCopyLink from './AsideMenuCopyLink.vue';

const { element } = defineProps<{
    element: ProseElement<AnySchema>;
}>();

const hasLink = computed(() => {
    return Boolean(element.id);
});

const hasButtons = computed(() => {
    return hasLink.value;
});

const phrase = await useElementPhrase(element);
</script>

<template>
    <div
        :style="{
            '--asideMenuGap': '5px',
            '--asideMenuGapBig': 'calc(var(--asideMenuGap) * 2)',
        }"
        class="bg-bg-main border-border flex w-40 flex-col rounded-sm border
            py-(--asideMenuGap) font-sans
            shadow-[0_0_12px_5px_light-dark(rgba(0,0,0,0.12),rgba(255,255,255,0.08))]
            backface-hidden"
    >
        <div
            class="flex items-center gap-(--asideMenuGapBig)
                px-(--asideMenuGapBig) py-(--asideMenuGap) text-xs font-medium"
        >
            <div>{{ phrase.element_name }}</div>
        </div>
        <AsideMenuSeparator v-if="hasButtons" />
        <AsideMenuCopyLink v-if="hasLink" :elementId="element.id!" />
    </div>
</template>
