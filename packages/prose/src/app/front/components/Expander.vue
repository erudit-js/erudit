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

import { useProseAppContext } from '../composables/appContext';

type ExpanderMode = 'transition' | 'instant';

const { instant = false } = defineProps<{
    instant?: boolean;
}>();

const _mode = ref<ExpanderMode>('instant');
const expanderHeight = ref(0);
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

watchEffect(() => {
    if (_mode.value === 'transition') {
        doResize();
    }
});

function doResize() {
    if (!expander.value || !pane.value || _mode.value === 'instant') {
        return;
    }
    const paneHeight = pane.value.offsetHeight;
    expanderHeight.value = paneHeight;
}

onMounted(() => {
    resizeObserver = new ResizeObserver(doResize);
    watch(
        () => instant,
        () => (_mode.value = instant ? 'instant' : 'transition'),
        { immediate: true },
    );
});
</script>

<template>
    <div
        ref="expander"
        :class="[
            'relative overflow-hidden',
            { ['transition-[height]']: _mode === 'transition' },
        ]"
        :style="{
            height: _mode === 'transition' ? expanderHeight + 'px' : '',
        }"
    >
        <TransitionFade :css="_mode === 'transition'">
            <div
                ref="pane"
                :class="[
                    'top-0 left-0 w-full',
                    { ['absolute']: _mode === 'transition' },
                ]"
                :key
            >
                <slot v-if="$slots.default"></slot>
                <div v-else></div>
            </div>
        </TransitionFade>
    </div>
</template>
