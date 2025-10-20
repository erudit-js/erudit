<script lang="ts" setup>
import type { ParsedElement } from '../../element';
import type { VideoSchema } from './video.global';
import { useElementStorage } from '../../app/front/composables/elementStorage';
import { useProseAppContext } from '../../app';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Caption from '../caption/Caption.vue';
import { darkInvert, lightInvert } from '../../shared';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

const { element } = defineProps<{ element: ParsedElement<VideoSchema> }>();
const videoStorage = await useElementStorage<VideoSchema>(element);
const { siteBaseUrl } = useProseAppContext();
const width = element.data.width ? `min(${element.data.width}, 100%)` : '';

const videoElement = useTemplateRef('video');
const observer = ref<IntersectionObserver | null>(null);

const wasInViewport = ref(false);
const manuallyPaused = ref(false);

if (!element.data.autoplay) {
    wasInViewport.value = true;
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
                wasInViewport.value = true;
                if (!manuallyPaused.value) video.play();
            } else {
                // When the video is not in the viewport:
                if (wasInViewport.value) {
                    // Video was in viewport before.
                    // If it is now leaving already paused then of course it was the user, who manually paused it.
                    manuallyPaused.value = video.paused;
                } else {
                    // Video was never in viewport before and user had no chance to pause it.
                    manuallyPaused.value = false;
                }

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
    <ProseBlock :element>
        <video
            ref="video"
            :src="siteBaseUrl + videoStorage.resolvedSrc"
            preload="metadata"
            loop
            muted
            controls
            :class="[
                'm-auto rounded-xl',
                {
                    [lightInvert + ' ' + $style.invertLight]:
                        element.data.invert === 'light',
                    [darkInvert + ' ' + $style.invertDark]:
                        element.data.invert === 'dark',
                },
            ]"
            v-bind="
                element.data.width
                    ? {
                          style: {
                              width: element.data.width,
                              maxWidth: `min(${element.data.width}, 100%)`,
                          },
                      }
                    : {}
            "
        ></video>
        <Caption
            v-if="element.children"
            :fallbackWidth="element.data.width"
            :caption="element.children[0]"
        />
    </ProseBlock>
</template>

<style module>
:root[data-theme='light'] .invertLight,
:root[data-theme='dark'] .invertDark {
    &::-webkit-media-controls-panel {
        filter: invert(1) hue-rotate(180deg);
    }
}
</style>
