<script lang="ts" setup>
import { onMounted, ref, useCssModule, useTemplateRef } from 'vue';

import { useBaseUrlPath, contentAsset } from '#imports';
import { type ImageParseData, type ImageRenderData } from './shared';
import FigureWrapper from '../../shared/figure/FigureWrapper.vue';
import { maxWidthCSS } from '../../shared/maxWidth';
import { usePhotoSwipe } from '../../shared/photoswipe/composable';

const props = defineProps<{
    parseData: ImageParseData;
    renderData: ImageRenderData;
}>();

const style = useCssModule();
const baseUrlPath = useBaseUrlPath();

const invertClass = (() => {
    return props.parseData.invert;
})();

const captionElement = ref<HTMLElement | null>(null);
const imageWrapper = useTemplateRef('imageWrapper');
const { lightbox, initLightbox, registerCaption } = usePhotoSwipe();

onMounted(() => {
    initLightbox({
        gallery: imageWrapper.value!,
        children: 'a',
        mainClass: Object.entries({
            [style.pswp_invertLight]: invertClass === 'light',
            [style.pswp_invertDark]: invertClass === 'dark',
        })
            .filter(([_, value]) => value)
            .map(([key, _]) => key)
            .join(' '),
    });

    if (captionElement.value) {
        registerCaption(lightbox.value!, captionElement.value);
    }
});
</script>

<template>
    <FigureWrapper
        :caption="parseData.caption"
        @captionMounted="(element) => (captionElement = element)"
    >
        <div ref="imageWrapper" :class="$style.imageWrapper">
            <a
                :href="baseUrlPath(contentAsset(renderData.resolvedSrc))"
                :data-pswp-width="renderData.size.width"
                :data-pswp-height="renderData.size.height"
                target="_blank"
            >
                <img
                    :src="baseUrlPath(contentAsset(renderData.resolvedSrc))"
                    :class="[
                        invertClass ? $style[`invert-${invertClass}`] : '',
                    ]"
                    :style="{
                        maxWidth: maxWidthCSS(parseData.maxWidth),
                    }"
                />
            </a>
        </div>
    </FigureWrapper>
</template>

<style lang="scss">
@use '../../shared/photoswipe/style';
</style>

<style lang="scss" module>
@use '../../shared/utils' as elementUtils;

.imageWrapper > a {
    display: flex;
    justify-content: center;
}

:root[data-theme='light'] {
    .pswp_invertLight {
        img {
            filter: elementUtils.$invertKeepColors;
        }
    }

    .invert-light {
        filter: elementUtils.$invertKeepColors;
    }
}

:root[data-theme='dark'] {
    .pswp_invertDark {
        img {
            filter: elementUtils.$invertKeepColors;
        }
    }

    .invert-dark {
        filter: elementUtils.$invertKeepColors;
    }
}
</style>
