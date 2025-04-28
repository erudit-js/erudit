<script lang="ts" setup>
import type { PreviewRequest } from '@app/scripts/preview/request';
import { type PreviewData } from '@app/scripts/preview/data';
import { buildPreviewData } from '@app/scripts/preview/build';
import { getPreviewDisplayComponent } from '@app/scripts/preview/display';
import { createPreviewError } from '@app/scripts/preview/data/alert';

import { LazyPreviewDisplayAlert } from '#components';

const { request } = defineProps<{ request: PreviewRequest }>();
const height = defineModel<number>('height');

const loading = ref(true);
const suspensePending = ref(true);
const effectiveLoading = computed(() => loading.value || suspensePending.value);

const loadingElem = useTemplateRef('loadingElem');
const screenElem = useTemplateRef('screenElem');
const screenSizeObserver = new ResizeObserver(updateContentHeight);

const DisplayComponent = shallowRef<Component>();
const previewData = shallowRef<PreviewData>();

const setupDisplay = setTimeout(async () => {
    //await new Promise(resolve => setTimeout(resolve, 5000));

    try {
        previewData.value = await buildPreviewData(request);
        DisplayComponent.value = getPreviewDisplayComponent(previewData.value);
    } catch (error) {
        console.error(error);

        previewData.value = createPreviewError({
            // @ts-ignore
            message: error?.message || error,
        });

        DisplayComponent.value = LazyPreviewDisplayAlert;
    }

    await nextTick();
    loading.value = false;
});

function updateContentHeight() {
    // Use the proper element for height calculation based on which one is visible
    const targetElem = effectiveLoading.value
        ? loadingElem.value
        : screenElem.value;
    if (!targetElem) return;

    height.value = targetElem.offsetHeight;
}

function onSuspenseResolve() {
    suspensePending.value = false;
}

onMounted(() => {
    // Initialize height with either element that's available
    const initialElement = loadingElem.value || screenElem.value;
    height.value = initialElement?.offsetHeight ?? 0;

    // Observe both elements for size changes
    watch(
        [loadingElem, screenElem, effectiveLoading],
        () => {
            screenSizeObserver.disconnect();

            // Observe loading element when it's visible
            if (effectiveLoading.value && loadingElem.value) {
                screenSizeObserver.observe(loadingElem.value);
            }
            // Otherwise observe content element
            else if (screenElem.value) {
                screenSizeObserver.observe(screenElem.value);
            }

            // Update height after elements change
            updateContentHeight();
        },
        { immediate: true },
    );
});

onUnmounted(() => {
    clearTimeout(setupDisplay);
    screenSizeObserver.disconnect();
});
</script>

<template>
    <div :class="$style.screenContainer">
        <TransitionFade>
            <div
                v-if="effectiveLoading"
                ref="loadingElem"
                :class="$style.loadingOverlay"
            >
                <PreviewLoading />
            </div>
        </TransitionFade>

        <div ref="screenElem" :class="$style.screen">
            <Suspense @resolve="onSuspenseResolve" v-if="DisplayComponent">
                <component :is="DisplayComponent" :data="previewData" />
                <template #fallback>
                    <div></div>
                </template>
            </Suspense>
        </div>
    </div>
</template>

<style lang="scss" module>
.screenContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.loadingOverlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    z-index: 2;
    background-color: var(--_previewThemeBg, var(--bgAside));
}

.screen {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1;
}
</style>
