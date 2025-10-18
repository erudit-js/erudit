<script lang="ts" setup>
import {
    useTemplateRef,
    onMounted,
    useSlots,
    ref,
    watch,
    nextTick,
    watchEffect,
} from 'vue';

import { useProseAppContext } from '../app/front/composables/appContext';
import { useAnchorResolving } from '../app/front/composables/anchor';

const { TransitionFade } = useProseAppContext();
const anchorResolving = useAnchorResolving();
const slots = useSlots();
const expander = useTemplateRef('expander');
const pane = useTemplateRef('pane');
const key = ref(0);
const absolute = ref(false);
const transition = ref(false);

let resizeObserver: ResizeObserver;

watch(
    () => slots.default?.(),
    () => key.value++,
);

watch(key, async () => {
    await nextPaint();
    resizeObserver ||= new ResizeObserver(updateExpanderHeight);
    resizeObserver.disconnect();
    resizeObserver.observe(pane.value!);
    updateExpanderHeight();
});

onMounted(async () => {
    updateExpanderHeight();

    await nextPaint();
    absolute.value = true;

    await nextPaint();
    transition.value = !anchorResolving.value;

    watchEffect(() => {
        transition.value = !anchorResolving.value;
    });
});

function updateExpanderHeight() {
    if (expander.value && pane.value) {
        expander.value.style.height = pane.value.offsetHeight + 'px';
    }
}

async function nextPaint() {
    await nextTick();
    await new Promise(requestAnimationFrame);
}
</script>

<template>
    <div
        ref="expander"
        :class="[
            'relative overflow-hidden',
            { ['transition-[height]']: transition },
        ]"
    >
        <TransitionFade>
            <div
                ref="pane"
                :key
                :class="[
                    'top-0 left-0 w-full',
                    absolute ? 'absolute' : 'static',
                ]"
            >
                <slot v-if="$slots.default"></slot>
                <div v-else></div>
            </div>
        </TransitionFade>
    </div>
</template>
