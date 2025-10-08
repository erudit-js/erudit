<script lang="ts" setup>
import {
    inject,
    onMounted,
    ref,
    useCssModule,
    useTemplateRef,
    watchEffect,
} from 'vue';

import type { ParsedElement } from '../../../element';
import type { BlockSchemaAny } from '../../../schema';
import { proseContextSymbol } from '../composables/appContext';
import { useElementIcon } from '../composables/elementIcon';
import { useIsAnchor, useJumpToAnchor } from '../composables/anchor';

const { element } = defineProps<{ element: ParsedElement<BlockSchemaAny> }>();
const { MaybeMyIcon, TransitionFade, loadingSvg } = inject(proseContextSymbol)!;
const style = useCssModule();

const blockElement = useTemplateRef('block');
const hover = ref(false);

const elementIcon = ref(loadingSvg);
useElementIcon(element).then((icon) => {
    elementIcon.value = icon;
});

const isAnchor = useIsAnchor(element);
const jumpToAnchor = useJumpToAnchor();

onMounted(() => {
    watchEffect(() => {
        if (isAnchor.value) {
            jumpToAnchor(blockElement.value!);
        }
    });

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
        :class="[style.block, 'scroll-mt-big pr-(--proseAsideWidth)']"
    >
        <div :class="[style.blockAbove, 'h-(--proseGap)']"></div>

        <div class="relative">
            <!-- Block Aside -->
            <aside
                class="group/aside absolute top-0 left-0 h-full
                    w-(--proseAsideWidth) cursor-pointer"
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
                                shadow-[0_0_18px_1px_var(--color-brand)]
                                [--overlayPadding:5px]"
                        ></div>
                    </div>
                </TransitionFade>
            </main>
        </div>

        <div :class="[style.blockBelow, 'h-(--proseGap)']"></div>
    </div>
</template>

<style module>
/* Always hide corresponding block gaps for frist/last blocks. */

.block:first-child > .blockAbove {
    display: none !important;
}

.block:last-child > .blockBelow {
    display: none !important;
}

/* Hiding bottom block gap by default, to compensate next block's top gap. */

.blockBelow {
    display: none;
}

/* When hover/focus show block bottom gap to increase hoverable area and hide next block's top gap so no gap duplication happens. */

.block:hover > .blockBelow,
.block:focus > .blockBelow {
    display: block;
}

.block:hover + .block > .blockAbove,
.block:focus + .block > .blockAbove {
    display: none;
}
</style>
