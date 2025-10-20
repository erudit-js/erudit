<script setup lang="ts">
import { shallowRef } from 'vue';

import type { ParsedElement } from '../../element';
import type { ImageSchema } from './image.global';
import { useElementStorage } from '../../app/front/composables/elementStorage';
import { useProseAppContext } from '../../app';
import { usePhotoSwipe } from '../../shared/photoswipe/composable';
import { darkInvert, lightInvert } from '../../shared/invert';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Caption from '../caption/Caption.vue';

const { element } = defineProps<{ element: ParsedElement<ImageSchema> }>();
const imageStorage = await useElementStorage<ImageSchema>(element);
const { siteBaseUrl } = useProseAppContext();

const captionElement = shallowRef<HTMLElement>();

const { lightbox, initLightbox } = usePhotoSwipe();

function imageClick() {
    if (!lightbox.value) {
        initLightbox(
            {
                dataSource: [
                    {
                        src: siteBaseUrl + imageStorage.resolvedSrc,
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
    <ProseBlock :element>
        <div class="text-center">
            <img
                :src="siteBaseUrl + imageStorage.resolvedSrc"
                @click="imageClick"
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
            :fallbackWidth="element.data.width"
            :caption="element.children[0]"
        />
    </ProseBlock>
</template>
