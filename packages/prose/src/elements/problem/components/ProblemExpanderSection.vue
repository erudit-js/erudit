<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import type { AnySchema, ProseElement } from '@jsprose/core';

import plusIcon from '../../../app/shared/assets/plus.svg?raw';
import { useProseContext } from '../../../app/composables/context.js';
import { useFormatText } from '../../../app/composables/formatText.js';
import { useContainsAnchor } from '../../../app/composables/anchor.js';
import Render from '../../../app/shared/Render.vue';

const { element } = defineProps<{
    title: string;
    element: ProseElement<AnySchema>;
}>();

const formatText = useFormatText();
const { EruditIcon } = useProseContext();
const opened = ref(false);
const containsAnchor = useContainsAnchor(element);

watchEffect(() => {
    if (containsAnchor.value) {
        opened.value = true;
    }
});
</script>

<template>
    <div
        @click="opened = !opened"
        class="group border-border text-text-muted relative flex cursor-pointer
            items-center border-t p-(--proseAsideWidth) font-semibold
            transition-[border] first:border-t-0"
    >
        <div class="flex-1">{{ formatText(title) }}</div>
        <button
            class="group-hocus:bg-border/80 text-text-muted shrink-0 rounded
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
    </div>
    <Suspense>
        <div
            v-if="opened"
            class="border-border border-t border-dashed py-(--proseAsideWidth)
                transition-[border]"
        >
            <Render v-for="child of element.children" :element="child" />
        </div>
    </Suspense>
</template>
