<script lang="ts" setup>
import {
    inject,
    onMounted,
    ref,
    useCssModule,
    useTemplateRef,
    watchEffect,
    onBeforeUnmount,
    watch,
} from 'vue';
import { autoUpdate, offset, shift, useFloating } from '@floating-ui/vue';

import type { ParsedElement } from '../../../element';
import type { BlockSchemaAny } from '../../../schema';
import { useProseAppContext } from '../composables/appContext';
import { useElementIcon } from '../composables/elementIcon';
import { useIsAnchor, useJumpToAnchor } from '../composables/anchor';
import { useIcon } from '../composables/icon';
import { useElementPhrase } from '../composables/elementPhrase';
import { useProseLanguage } from '../composables/proseLanguage';
import AsideMenu from './blockAsideMenu/AsideMenu.vue';

const { element } = defineProps<{ element: ParsedElement<BlockSchemaAny> }>();
const Icon = useIcon();
const { TransitionFade } = useProseAppContext();
const style = useCssModule();

const blockElement = useTemplateRef('block');
const asideElement = useTemplateRef('aside');
const asideMenuElement = useTemplateRef('asideMenu');
const hover = ref(false);
const menuVisible = ref(false);

const { floatingStyles: floatingMenuStyle } = useFloating(
    asideElement,
    asideMenuElement,
    {
        whileElementsMounted: autoUpdate,
        placement: 'right-start',
        strategy: 'fixed',
        middleware: [offset(10), shift({ rootBoundary: 'viewport' })],
    },
);

await useProseLanguage();
await useElementPhrase(element);
const elementIcon = await useElementIcon(element);

const isAnchor = useIsAnchor(element);
const jumpToAnchor = useJumpToAnchor();

const outsideClickHandler = (e: MouseEvent) => {
    if (!menuVisible.value) return;
    const aside = asideElement.value;
    if (!aside) return;
    if (aside.contains(e.target as Node)) return;
    menuVisible.value = false;
};

watch(menuVisible, (visible) => {
    if (visible) {
        document.addEventListener('click', outsideClickHandler);
    } else {
        document.removeEventListener('click', outsideClickHandler);
    }
});

onMounted(() => {
    watchEffect(() => {
        if (isAnchor.value) {
            jumpToAnchor(blockElement.value!);
        }
    });

    hover.value = blockElement.value!.matches(':hover');

    blockElement.value!.addEventListener('mouseenter', () => {
        hover.value = true;
    });

    blockElement.value!.addEventListener('mouseleave', () => {
        hover.value = false;
    });
});

onBeforeUnmount(() => {
    document.removeEventListener('click', outsideClickHandler);
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
                ref="aside"
                @click="menuVisible = !menuVisible"
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
                            <Icon
                                :name="elementIcon"
                                class="micro:w-[60%] text-text-dimmed
                                    group-hocus/aside:text-text m-auto mt-[2px]
                                    aspect-square w-[70%] transition-[color]"
                            />
                        </div>
                    </TransitionFade>
                </div>
                <!-- Aside Menu -->
                <TransitionFade>
                    <div
                        ref="asideMenu"
                        :style="floatingMenuStyle"
                        v-if="menuVisible"
                        @click.stop
                        class="z-10 cursor-auto"
                    >
                        <AsideMenu :element />
                    </div>
                </TransitionFade>
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
