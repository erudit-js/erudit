<script lang="ts" setup>
import type { PreviewRequest } from '@app/scripts/preview/request';
import { type PreviewData } from '@app/scripts/preview/data';
import { buildPreviewData } from '@app/scripts/preview/build';
import { getPreviewDisplayComponent } from '@app/scripts/preview/display';
import { createPreviewError } from '@app/scripts/preview/data/alert';

import { PreviewDisplayAlert } from '#components';

const { request } = defineProps<{ request: PreviewRequest }>();
const height = defineModel<number>('height');

const loading = ref(true);

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

        DisplayComponent.value = PreviewDisplayAlert;
    }

    await nextTick();
    loading.value = false;
});

function updateContentHeight() {
    if (!screenElem.value) return;

    height.value = screenElem.value.offsetHeight;
}

onMounted(() => {
    height.value = screenElem.value?.offsetHeight ?? 0;

    watch(
        screenElem,
        () => {
            if (screenElem.value) {
                screenSizeObserver.disconnect();
                screenSizeObserver.observe(screenElem.value);
            }
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
                ref="screenElem"
                :class="$style.screen"
                :key="loading ? 'a' : 'b'"
            >
                <PreviewLoading v-if="loading" />
                <component v-else :is="DisplayComponent" :data="previewData" />
            </div>
        </TransitionFade>
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

.screen {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>
