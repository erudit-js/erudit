<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import type { calloutSchema } from './core.js';
import { useElementStorage } from '../../app/composables/storage.js';
import { useFormatText } from '../../app/composables/formatText.js';
import Block from '../../app/shared/block/Block.vue';
import Render from '../../app/shared/Render.vue';

const { element } = defineProps<{
    element: ProseElement<typeof calloutSchema>;
}>();
const calloutStorage = await useElementStorage<typeof calloutSchema>(element);
const formatText = useFormatText();
</script>

<template>
    <Block :element>
        <div
            :style="{ '--calloutBg': 'light-dark(#f7f7f7, #1c1c1c)' }"
            class="gap-big flex"
        >
            <div class="max-micro:hidden shrink-0">
                <img
                    :src="calloutStorage.resolvedIconSrc"
                    class="outline-border size-[60px] rounded-full border-2
                        border-transparent outline-2 transition-[outline]"
                />
            </div>
            <div
                class="border-border/90 relative flex-1 rounded-xl border
                    bg-(--calloutBg) py-(--proseAsideWidth) font-serif shadow-md
                    transition-[border,background]"
            >
                <div
                    :class="$style.arrow"
                    class="max-micro:hidden transition-[border]"
                >
                    <div :class="$style.fill" class="transition-[border]"></div>
                </div>
                <header
                    class="gap-small mb-(--proseAsideWidth) flex items-center
                        px-(--proseAsideWidth) font-semibold transition-[color]"
                >
                    <img
                        :src="calloutStorage.resolvedIconSrc"
                        class="micro:hidden size-[30px] shrink-0 rounded-full"
                    />
                    <div class="text-text-deep flex-1">
                        {{ formatText(element.data.title) }}
                    </div>
                </header>
                <main class="text-main-sm">
                    <Render
                        v-for="child of element.children"
                        :element="child"
                    />
                </main>
            </div>
        </div>
    </Block>
</template>

<style module>
.arrow {
    --arrowSize: 18px;
    border-bottom: var(--arrowSize) solid transparent;
    border-right: var(--arrowSize) solid var(--color-border);
    border-top: var(--arrowSize) solid transparent;
    height: 0;
    position: absolute;
    left: calc(-1 * var(--arrowSize));
    top: calc(var(--proseAsideWidth) - var(--arrowSize) / 4);
    width: 0;

    .fill {
        border-bottom: calc(var(--arrowSize) - 1px) solid transparent;
        border-right: calc(var(--arrowSize) - 1px) solid var(--calloutBg);
        border-top: calc(var(--arrowSize) - 1px) solid transparent;
        height: 0;
        left: 1.5px;
        position: absolute;
        transform: translateY(-50%);
        width: 0;
    }
}
</style>
