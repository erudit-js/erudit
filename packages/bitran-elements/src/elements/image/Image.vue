<script lang="ts" setup>
import PhotoSwipeLightbox from 'photoswipe/lightbox';

import {
    onMounted,
    onUnmounted,
    ref,
    shallowRef,
    useCssModule,
    useTemplateRef,
} from 'vue';

import captionClasses from '../../figure/caption.module.scss';
import { useBaseUrlPath, contentAsset } from '#imports';
import { type ImageParseData, type ImageRenderData } from './shared';
import FigureWrapper from '../../figure/FigureWrapper.vue';

const props = defineProps<{
    parseData: ImageParseData;
    renderData: ImageRenderData;
}>();

const style = useCssModule();
const baseUrlPath = useBaseUrlPath();

const invertClass = (() => {
    return props.parseData.invert;
})();

const lightbox = shallowRef<PhotoSwipeLightbox>();
const captionElement = ref<HTMLElement | null>(null);
const imageWrapper = useTemplateRef('imageWrapper');

onMounted(() => {
    lightbox.value = new PhotoSwipeLightbox({
        gallery: imageWrapper.value!,
        children: 'a',
        bgOpacity: 1,
        imageClickAction: 'toggle-controls',
        bgClickAction: 'close',
        doubleTapAction: 'zoom',
        mainClass: Object.entries({
            [style.pswp]: true,
            [style.pswp_invertLight]: invertClass === 'light',
            [style.pswp_invertDark]: invertClass === 'dark',
        })
            .filter(([_, value]) => value)
            .map(([key, _]) => key)
            .join(' '),
        pswpModule: () => import('photoswipe'),
    });

    lightbox.value.on('uiRegister', () => {
        if (!captionElement.value) return;

        lightbox.value!.pswp!.ui!.registerElement({
            name: 'caption',
            className: `${captionClasses.caption} ${captionClasses.photoswipe}`,
            order: 9,
            isButton: false,
            appendTo: 'root',
            html: captionElement.value.getHTML(),
        });
    });

    lightbox.value.init();
});

onUnmounted(() => {
    if (lightbox.value) {
        lightbox.value.destroy();
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
                        maxWidth: parseData.maxWidth
                            ? parseData.maxWidth
                            : '100%',
                    }"
                />
            </a>
        </div>
    </FigureWrapper>
</template>

<style lang="scss">
@use 'photoswipe/style.css';

.pswp__icn {
    width: 40px;
    height: 40px;
    padding: 3px;
    background: color-mix(in srgb, light-dark(white, black), transparent 30%);
    border-radius: 50%;
}
</style>

<style lang="scss" module>
@use '../../figure/caption.module';
@use '../../styles/utils' as elementUtils;

.imageWrapper {
    display: flex;
    justify-content: center;
}

:root[data-theme='light'] {
    .pswp {
        --pswp-bg: white;
        --pswp-icon-color: #3f3f3f;
        --pswp-icon-color-secondary: white;
        --pswp-icon-stroke-color: #3f3f3f;
    }

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
    .pswp {
        --pswp-bg: black;
    }

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
