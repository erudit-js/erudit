<script lang="ts" setup>
import { ref } from 'vue';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import { useElementStorage } from '../../app/front/composables/elementStorage';
import type { ParsedElement } from '../../element';
import type { GallerySchema } from './gallery.global';
import { darkInvert, lightInvert } from '../../shared';
import Expander from '../../shared/Expander.vue';
import ImageElement from '../image/ImageElement.vue';

const { element } = defineProps<{ element: ParsedElement<GallerySchema> }>();

const resolvedSrc = await (async () => {
    return (
        await Promise.all(
            element.children.map((child) => useElementStorage(child)),
        )
    ).map((storage) => storage.resolvedSrc);
})();

const activeI = ref<number>(0);
</script>

<template>
    <ProseBlock :element>
        <div class="nice-scrollbars mb-normal flex overflow-auto">
            <div class="gap-normal p-small m-auto flex">
                <button
                    v-for="(image, i) of element.children"
                    @click="activeI = i"
                    :class="[
                        `aspect-square w-[70px] cursor-pointer rounded-xl
                        border-2 transition-[border]`,
                        {
                            'border-border hocus:border-brand': activeI !== i,
                            'border-brand': activeI === i,
                        },
                    ]"
                >
                    <img
                        :src="resolvedSrc[i]"
                        :class="[
                            'block object-cover',
                            {
                                [lightInvert]: image.data.invert === 'light',
                                [darkInvert]: image.data.invert === 'dark',
                            },
                        ]"
                    />
                </button>
            </div>
        </div>
        <Expander>
            <ImageElement :element="element.children[activeI]" :key="activeI" />
        </Expander>
    </ProseBlock>
</template>
