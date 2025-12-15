<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import type { ProseElement } from '@jsprose/core';

import type { AccentSectionSchema } from './core.js';
import { useArrayContainsAnchor } from '../../app/composables/anchor.js';
import Render from '../../app/shared/Render.vue';

const { sections } = defineProps<{
    sectionTitles: string[];
    sections: ProseElement<AccentSectionSchema>[];
}>();

const openedSectionI = ref<number>();
const containsAnchorI = useArrayContainsAnchor(sections);

watchEffect(() => {
    if (containsAnchorI.value !== undefined) {
        openedSectionI.value = containsAnchorI.value;
    }
});
</script>

<template>
    <div
        :class="[
            `relative flex flex-wrap items-center gap-(--proseAsideWidth)
            p-(--proseAsideWidth) pt-0`,
        ]"
    >
        <button
            v-for="(_section, i) of sections"
            @click="openedSectionI = i === openedSectionI ? undefined : i"
            :class="[
                `text-main-sm micro:py-2 micro:px-2.5 cursor-pointer rounded-xl
                px-2 py-1.5 font-medium transition-[color,background]`,
                i === openedSectionI
                    ? 'bg-(--accentText)/80 text-white'
                    : `hocus:bg-(--accentText)/30 bg-(--accentText)/15
                        text-(--accentText)`,
            ]"
        >
            {{ sectionTitles[i] }}
        </button>
        <div
            :class="[
                `absolute bottom-0 left-0 w-full border-b
                border-(--accentBorder) transition-[border]`,
                openedSectionI === undefined ? 'opacity-0' : 'opacity-100',
            ]"
        ></div>
    </div>
    <div
        v-if="openedSectionI !== undefined"
        :key="openedSectionI"
        class="py-(--proseAsideWidth)"
    >
        <Render
            v-for="child of sections[openedSectionI].children"
            :element="child"
        />
    </div>
</template>
