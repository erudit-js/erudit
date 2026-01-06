<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import type { ProseElement } from '@jsprose/core';

import type { AccentSectionSchema } from './core.js';
import { useProseContext } from '../../app/composables/context.js';
import { useContainsAnchor } from '../../app/composables/anchor.js';
import plusIcon from '../../app/shared/assets/plus.svg?raw';
import Render from '../../app/shared/Render.vue';

const { section } = defineProps<{
    title: string;
    section: ProseElement<AccentSectionSchema>;
}>();

const { EruditIcon } = useProseContext();
const containsAnchor = useContainsAnchor(section);

const opened = ref(false);

watchEffect(() => {
    if (containsAnchor.value) {
        opened.value = true;
    }
});
</script>

<template>
    <div>
        <div
            @click="opened = !opened"
            class="group relative flex cursor-pointer items-center border-t
                border-(--accentBorder) p-(--proseAsideWidth) font-medium
                text-(--accentText) transition-[border]"
        >
            <div class="flex-1">{{ title }}</div>
            <button
                class="group-hocus:bg-(--accentBorder)/70 shrink-0 rounded
                    bg-transparent p-0.5 transition-[background]"
            >
                <EruditIcon
                    :name="plusIcon"
                    :class="[
                        'micro:text-[26px] text-[22px] transition-[rotate]',
                        opened ? 'rotate-45' : '',
                    ]"
                />
            </button>
            <div
                :class="[
                    `absolute bottom-0 left-0 w-full border-b border-dashed
                    border-(--accentBorder) transition-[border]`,
                    opened ? 'opacity-100' : 'opacity-0',
                ]"
            ></div>
        </div>
        <div class="py-(--proseAsideWidth)" v-if="opened">
            <Render v-for="child of section.children" :element="child" />
        </div>
    </div>
</template>
