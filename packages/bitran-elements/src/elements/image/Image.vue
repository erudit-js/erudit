<script lang="ts" setup>
import {
    type ElementProps,
    useElementParseData,
    useElementRenderData,
} from '@bitran-js/renderer-vue';

import PhotoSwipeLightbox from 'photoswipe/lightbox';

import {
    contentAsset,
    onMounted,
    onUnmounted,
    shallowRef,
    useBaseUrlPath,
    useCssModule,
    useTemplateRef,
} from '#imports';

import captionClasses from '../../figure/caption.module.scss';
import { type ImageSchema } from './shared';
import FigureWrapper from '../../figure/FigureWrapper.vue';

defineProps<ElementProps<ImageSchema>>();

const style = useCssModule();
const baseUrlPath = useBaseUrlPath();

const parseData = useElementParseData<ImageSchema>();
const renderData = useElementRenderData<ImageSchema>();

const invertClass = (() => {
    return parseData.invert;
})();

const lightbox = shallowRef<PhotoSwipeLightbox>();
const figureElement = useTemplateRef('figure');

onMounted(() => {
    lightbox.value = new PhotoSwipeLightbox({
        gallery: '.pswp-image',
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

    const captionHtml = figureElement.value?.parentElement
        ?.querySelector('figcaption')
        ?.getHTML();

    if (captionHtml) {
        lightbox.value.on('uiRegister', () => {
            lightbox.value!.pswp!.ui!.registerElement({
                name: 'caption',
                className: `${captionClasses.caption} ${captionClasses.photoswipe}`,
                order: 9,
                isButton: false,
                appendTo: 'root',
                html: captionHtml,
            });
        });
    }

    lightbox.value.init();
});

onUnmounted(() => {
    if (lightbox.value) {
        lightbox.value.destroy();
    }
});
</script>

<template>
    <FigureWrapper :caption="parseData.caption">
        <div class="pswp-image" ref="figure">
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

:global(.pswp-image) {
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
            filter: invert(1);
        }
    }

    .invert-light {
        filter: invert(1);
    }
}

:root[data-theme='dark'] {
    .pswp {
        --pswp-bg: black;
    }

    .pswp_invertDark {
        img {
            filter: invert(1);
        }
    }

    .invert-dark {
        filter: invert(1);
    }
}
</style>
