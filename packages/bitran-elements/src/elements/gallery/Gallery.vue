<script lang="ts" setup>
import {
    useElementParseData,
    useElementRenderData,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import Image from '../image/Image.vue';
import { type GallerySchema } from './shared';
import {
    contentAsset,
    ref,
    useBaseUrlPath,
    onMounted,
    onUnmounted,
    watch,
    useTemplateRef,
    nextTick,
} from '#imports';

defineProps<ElementProps<GallerySchema>>();

const baseUrlPath = useBaseUrlPath();

const parseData = useElementParseData<GallerySchema>();
const renderData = useElementRenderData<GallerySchema>();

const staticFirstImage = ref(true); // Start with static positioning
const animatedHeight = ref(false); // No height animation initially
const currentIndex = ref(0);

const imageRef = useTemplateRef('imageRef');
const wrapperRef = useTemplateRef('wrapperRef');
const resizeObserver = ref<ResizeObserver | null>(null);

const updateWrapperHeight = () => {
    if (!imageRef.value || !wrapperRef.value) return;
    wrapperRef.value.style.height = `${imageRef.value.offsetHeight}px`;
};

onMounted(() => {
    resizeObserver.value = new ResizeObserver(updateWrapperHeight);

    if (imageRef.value && resizeObserver.value) {
        updateWrapperHeight();
        resizeObserver.value.observe(imageRef.value);
        nextTick().then(() => {
            // First disable static positioning
            staticFirstImage.value = false;
            // Then after a small delay, enable height animation
            setTimeout(() => {
                animatedHeight.value = true;
            }, 100);
        });
    }
});

onUnmounted(() => {
    if (resizeObserver.value) {
        resizeObserver.value.disconnect();
    }
});

watch(currentIndex, async () => {
    if (resizeObserver.value) {
        resizeObserver.value.disconnect();
    }

    await new Promise((resolve) => setTimeout(resolve, 10));

    if (imageRef.value && resizeObserver.value) {
        resizeObserver.value.observe(imageRef.value);
        updateWrapperHeight();
    }
});
</script>

<template>
    <div :class="$style.gallery">
        <div :class="$style.selector">
            <div :class="$style.inner">
                <button
                    v-for="(_, i) in parseData.images"
                    :class="{
                        [$style.item]: true,
                        [$style.current]: currentIndex === i,
                        [$style.invertLight]:
                            parseData.images[i]!.invert === 'light',
                        [$style.invertDark]:
                            parseData.images[i]!.invert === 'dark',
                    }"
                    @click="currentIndex = i"
                    :key="i"
                >
                    <div>
                        <img
                            :src="
                                baseUrlPath(
                                    contentAsset(
                                        renderData.images[i]!.resolvedSrc,
                                    ),
                                )
                            "
                        />
                    </div>
                </button>
            </div>
        </div>
        <div
            :class="[
                $style.imageWrapper,
                animatedHeight && $style.animateHeight,
            ]"
            ref="wrapperRef"
        >
            <TransitionFade>
                <div
                    ref="imageRef"
                    :key="currentIndex"
                    :class="[staticFirstImage && $style.static]"
                >
                    <Image
                        :parseData="parseData.images[currentIndex]!"
                        :renderData="renderData.images[currentIndex]!"
                    />
                </div>
            </TransitionFade>
        </div>
    </div>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;
@use '../../styles/utils' as elementUtils;

.gallery {
    .selector {
        display: flex;
        margin-bottom: var(--bitran_gapSmall);

        @include elementUtils.scrollbar;

        .inner {
            display: flex;
            gap: var(--bitran_gap);
            padding: var(--bitran_gapSmall);
            margin: auto;

            .item {
                width: 70px;
                aspect-ratio: 1;
                border-radius: 3px;
                border: 2px solid var(--bitran_colorBorder);
                cursor: pointer;

                @include bitranUtils.transition(border-color);

                &:hover {
                    border-color: var(--bitran_colorBrand);
                }

                &.current {
                    border-color: var(--bitran_colorBrand);
                }

                :root[data-theme='light'] &.invertLight img {
                    filter: elementUtils.$invertKeepColors;
                }

                :root[data-theme='dark'] &.invertDark img {
                    filter: elementUtils.$invertKeepColors;
                }

                > div {
                    border: 2px solid var(--bgMain);
                }

                img {
                    display: block;
                    object-fit: cover;
                }
            }
        }
    }

    .imageWrapper {
        position: relative;
        overflow: hidden;
        height: auto;

        &.animateHeight {
            @include bitranUtils.transition(height);
        }

        > div {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;

            &.static {
                position: static;
            }
        }
    }
}
</style>
