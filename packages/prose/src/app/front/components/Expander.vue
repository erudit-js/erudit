<script lang="ts" setup>
import {
    inject,
    useTemplateRef,
    onMounted,
    useSlots,
    computed,
    ref,
    watch,
    nextTick,
} from 'vue';

import {
    proseContextSymbol,
    useProseAppContext,
} from '../composables/appContext';

const { TransitionFade } = useProseAppContext();
const slots = useSlots();
const key = ref(0);
const expander = useTemplateRef('expander');
const pane = useTemplateRef('pane');
let resizeObserver: ResizeObserver;

watch(
    () => slots.default?.(),
    () => key.value++,
);

watch(key, async () => {
    /*
        We need to delay because the DOM needs to update before we measure it.
        The height transition speed is fast, so not waiting for actual height might result in
        bad looking "jumps" from previous screen halfway to 0 and then to actual new screen height.
    */
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 50));
    resizeObserver.disconnect();
    resizeObserver.observe(pane.value!);
    doResize();
});

function doResize() {
    if (!expander.value || !pane.value) {
        return;
    }

    const paneHeight = pane.value.offsetHeight;
    expander.value.style.height = paneHeight + 'px';
}

onMounted(() => {
    resizeObserver = new ResizeObserver(doResize);
});
</script>

<template>
    <div ref="expander" class="relative overflow-hidden transition-[height]">
        <TransitionFade>
            <div ref="pane" class="absolute top-0 left-0 w-full" :key>
                <slot v-if="$slots.default"></slot>
                <div v-else></div>
            </div>
        </TransitionFade>
    </div>
</template>
