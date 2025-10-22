<script lang="ts" setup>
import { useElementStorage } from '../../app/front/composables/elementStorage';
import type { ParsedElement } from '../../element';
import type { CalloutSchema } from './callout.global';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Render from '../../app/front/components/Render.vue';
import { useFormatText } from '../../app';

const { element } = defineProps<{ element: ParsedElement<CalloutSchema> }>();
const calloutStorage = await useElementStorage<CalloutSchema>(element);
const formatText = useFormatText();
</script>

<template>
    <ProseBlock :element>
        <div
            :style="{ '--calloutBg': 'light-dark(#f7f7f7, #1c1c1c)' }"
            class="gap-big flex"
        >
            <div class="max-micro:hidden shrink-0">
                <img
                    :src="calloutStorage.resolvedSrc"
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
                        :src="calloutStorage.resolvedSrc"
                        class="micro:hidden size-[30px] shrink-0 rounded-full"
                    />
                    <div class="text-text-deep flex-1">
                        {{ formatText(element.data.title) }}
                    </div>
                </header>
                <main>
                    <Render
                        v-for="child of element.children"
                        :element="child"
                    />
                </main>
            </div>
        </div>
    </ProseBlock>
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
