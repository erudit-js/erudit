<script setup lang="ts">
import { shallowRef } from 'vue';
import type { ProseElement } from '@jsprose/core';

import type { imageSchema } from './core.js';
import { useElementStorage } from '../../app/composables/storage.js';
import { usePhotoSwipe } from '../../app/shared/photoswipe/composable.js';
import { lightInvert, darkInvert } from '../../app/shared/invert.js';
import Caption from '../caption/Caption.vue';

const { element } = defineProps<{
    element: ProseElement<typeof imageSchema>;
}>();
const imageStorage = await useElementStorage<typeof imageSchema>(element);

const captionElement = shallowRef<HTMLElement>();
const { lightbox, initLightbox } = usePhotoSwipe();

function imageClick() {
    if (!lightbox.value) {
        initLightbox(
            {
                dataSource: [
                    {
                        src: imageStorage.resolvedSrc,
                        width: imageStorage.width,
                        height: imageStorage.height,
                        type: 'image',
                    },
                ],
            },
            captionElement.value,
        );

        lightbox.value!.on('contentActivate', (event) => {
            event.content.element!.className +=
                ' ' +
                (element.data.invert === 'light'
                    ? lightInvert
                    : element.data.invert === 'dark'
                      ? darkInvert
                      : '');
        });
    }

    lightbox.value!.loadAndOpen(0);
}
</script>

<template>
    <div class="text-center">
        <img
            :src="imageStorage.resolvedSrc"
            @click="imageClick"
            loading="lazy"
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
            :class="[
                'inline-block cursor-pointer rounded-xl',
                {
                    [lightInvert]: element.data.invert === 'light',
                    [darkInvert]: element.data.invert === 'dark',
                },
            ]"
        />
    </div>
    <Caption
        v-if="element.children"
        @captionMounted="(element) => (captionElement = element)"
        :caption="element.children[0]"
    />
</template>
