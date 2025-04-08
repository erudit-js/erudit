<script lang="ts" setup>
import { useCssModule, ref, onMounted, onUnmounted, useTemplateRef } from 'vue';

import {
    useElementParseData,
    useElementRenderData,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import { type VideoSchema } from './shared';
import FigureWrapper from '../../figure/FigureWrapper.vue';
import { maxWidthCSS } from '../../utils/maxWidth';

import { useBaseUrlPath, contentAsset } from '#imports';

defineProps<ElementProps<VideoSchema>>();

const classes = useCssModule();

const baseUrlPath = useBaseUrlPath();

const parseData = useElementParseData<VideoSchema>();
const renderData = useElementRenderData<VideoSchema>();

const videoElement = useTemplateRef('video');
const observer = ref<IntersectionObserver | null>(null);

const inited = ref(false);
const manuallyPaused = ref(false);

if (!parseData.autoplay.value) {
    inited.value = true;
    manuallyPaused.value = true;
}

onMounted(() => {
    if (!videoElement.value) return;

    const video = videoElement.value;

    const options: IntersectionObserverInit = {
        rootMargin: '0px 0px 75px 0px',
        threshold: 0,
    };

    observer.value = new IntersectionObserver((entries) => {
        const entry = entries[0]!;
        try {
            if (entry.isIntersecting) {
                inited.value = true;
                if (!manuallyPaused.value) video.play();
            } else {
                manuallyPaused.value = inited.value ? video.paused : false;
                video.pause();
            }
        } catch {}
    }, options);

    observer.value.observe(video);
});

onUnmounted(() => {
    if (observer.value) {
        observer.value.disconnect();
    }
});
</script>

<template>
    <FigureWrapper :caption="parseData.caption">
        <video
            ref="video"
            :src="baseUrlPath(contentAsset(renderData.resolvedSrc))"
            preload="metadata"
            loop
            muted
            controls
            :class="{
                [classes.video]: true,
                [classes[`invert-${parseData.invert}`]!]: !!parseData.invert,
            }"
            :style="{
                maxWidth: maxWidthCSS(parseData.maxWidth),
            }"
        ></video>
    </FigureWrapper>
</template>

<style lang="scss" module>
@use '../../styles/utils' as elementUtils;

.video {
    margin: 0 auto;

    :root[data-theme='light'] &.invert-light {
        filter: elementUtils.$invertKeepColors;
        &::-webkit-media-controls-panel {
            filter: elementUtils.$invertKeepColors;
        }
    }

    :root[data-theme='dark'] &.invert-dark {
        filter: elementUtils.$invertKeepColors;
        &::-webkit-media-controls-panel {
            filter: elementUtils.$invertKeepColors;
        }
    }
}
</style>
