<script lang="ts" setup>
import { nextTick, onUnmounted, ref, useTemplateRef } from 'vue';

defineProps<{ paneKey: number | string | symbol }>();

const paneViewElement = useTemplateRef('paneView');
const paneWrapperElement = useTemplateRef('paneWrapper');
const staticMode = ref(true);
const resizeObserver = ref<ResizeObserver>();

function setPaneViewHeight() {
    paneViewElement.value!.style.height = `${paneWrapperElement.value!.offsetHeight}px`;
}

async function transitionEnter(element: HTMLElement) {
    resizeObserver.value ||= new ResizeObserver(() => setPaneViewHeight());
    resizeObserver.value.disconnect();
    resizeObserver.value.observe(element);

    await nextTick();
    staticMode.value = false;
}

onUnmounted(() => {
    resizeObserver.value?.disconnect();
});
</script>

<template>
    <section ref="paneView" :class="$style.paneView">
        <TransitionFade @enter="transitionEnter">
            <div
                ref="paneWrapper"
                :key="paneKey"
                :class="{
                    [$style.paneWrapper]: true,
                    [$style.static]: staticMode,
                }"
            >
                <slot></slot>
            </div>
        </TransitionFade>
    </section>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;

.paneView {
    position: relative;
    overflow: hidden;
    height: auto;
    @include bitranUtils.transition(height);

    .paneWrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;

        &.static {
            position: static;
        }
    }
}
</style>
