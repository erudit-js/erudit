<script setup lang="ts">
import { computed } from 'vue';

import AsideMenuCopyLink from './AsideMenuCopyLink.vue';
import AsideMenuSeparator from './AsideMenuSeparator.vue';
import type { ParsedElement } from '../../../../element';
import type { ElementSchemaAny } from '../../../../schema';
import { useElementPhrase } from '../../composables/elementPhrase';

const { element } = defineProps<{
    element: ParsedElement<ElementSchemaAny>;
}>();

const hasLink = computed(() => {
    return Boolean(element.domId);
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
        class="bg-bg-main border-border flex w-[160px] flex-col rounded-sm
            border py-(--asideMenuGap) font-sans
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
        <AsideMenuCopyLink v-if="hasLink" :domId="element.domId!" />
    </div>
</template>
