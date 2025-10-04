<script lang="ts" setup>
import { inject, onMounted, ref, useTemplateRef, watch } from 'vue';

import type { ParsedElement } from '../../../element';
import type { BlockSchemaAny } from '../../../schema';
import { proseContextSymbol } from '../composables/appContext';
import { useElementIcon } from '../composables/elementIcon';
import { useIsAnchor } from '../composables/anchor';

const { element } = defineProps<{ element: ParsedElement<BlockSchemaAny> }>();
const { MaybeMyIcon, TransitionFade, loadingSvg } = inject(proseContextSymbol)!;

const blockElement = useTemplateRef('block');
const hover = ref(false);

const elementIcon = ref(loadingSvg);
useElementIcon(element).then((icon) => {
    elementIcon.value = icon;
});

const isAnchor = useIsAnchor(element);

onMounted(() => {
    watch(
        isAnchor,
        () => {
            if (isAnchor.value) {
                blockElement.value!.scrollIntoView();
            }
        },
        { immediate: true },
    );

    blockElement.value!.addEventListener('mouseenter', () => {
        hover.value = true;
    });

    blockElement.value!.addEventListener('mouseleave', () => {
        hover.value = false;
    });
});
</script>

<template>
    <div
        ref="block"
        :id="element.domId"
        class="group/block hocus:not-last:-mb-(--proseGap) hocus:not-last:z-10
            relative pr-(--proseAsideWidth)"
    >
        <div class="h-(--proseGap) group-first/block:hidden"></div>

        <div class="relative">
            <!-- Block Aside -->
            <aside
                class="group/aside absolute top-0 left-0 h-full
                    w-[calc(var(--proseAsideWidth)-2px)] cursor-pointer"
            >
                <!-- Aside Background -->
                <div
                    class="micro:rounded-sm group-hocus/aside:bg-bg-accent
                        absolute top-0 left-0 h-full w-full bg-transparent
                        transition-[background]"
                ></div>
                <!-- Aside Icon -->
                <div class="sticky top-0">
                    <TransitionFade mode="out-in">
                        <div v-if="hover" :key="elementIcon">
                            <MaybeMyIcon
                                :name="elementIcon"
                                class="micro:w-[60%] text-text-dimmed
                                    group-hocus/aside:text-text m-auto mt-[2px]
                                    aspect-square w-[70%] transition-[color]"
                            />
                        </div>
                    </TransitionFade>
                </div>
            </aside>

            <!-- Block Content -->
            <main class="relative ml-(--proseAsideWidth)">
                <slot></slot>
                <!-- Anchor Overlay -->
                <TransitionFade>
                    <div v-if="isAnchor">
                        <div
                            class="bg-brand animate-fade-out pointer-events-none
                                absolute -top-(--overlayPadding)
                                -right-(--overlayPadding)
                                -bottom-(--overlayPadding)
                                -left-(--overlayPadding) touch-none rounded
                                opacity-0
                                shadow-[0_0_18px_2px_var(--color-brand)]
                                [--overlayPadding:5px]"
                        ></div>
                    </div>
                </TransitionFade>
            </main>
        </div>

        <div
            class="group-not-hocus/block:hidden h-(--proseGap)
                group-last/block:hidden"
        ></div>
    </div>
</template>
