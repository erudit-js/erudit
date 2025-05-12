<script lang="ts" setup>
import { ref } from 'vue';
import {
    useElementParseData,
    useElementRenderData,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import Image from '../image/Image.vue';
import PaneView from '../../shared/PaneView.vue';
import { type GallerySchema } from './shared';
import { contentAsset, useBaseUrlPath } from '#imports';

defineProps<ElementProps<GallerySchema>>();

const baseUrlPath = useBaseUrlPath();

const parseData = useElementParseData<GallerySchema>();
const renderData = useElementRenderData<GallerySchema>();

const currentIndex = ref(0);
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
                            loading="lazy"
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

        <PaneView :paneKey="currentIndex">
            <Image
                :parseData="parseData.images[currentIndex]!"
                :renderData="renderData.images[currentIndex]!"
            />
        </PaneView>
    </div>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;
@use '../../shared/utils' as elementUtils;

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
}
</style>
