<script setup lang="ts">
import { ref } from 'vue';
import {
    Render,
    useElementIcon,
    useElementMeta,
    useElementParseData,
    useElementPhrases,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import { MyRuntimeIcon } from '#components';

import toggleIcon from './toggle.svg?raw';
import type { DetailsSchema } from './shared';

defineProps<ElementProps<DetailsSchema>>();
const meta = useElementMeta<DetailsSchema>();
const content = useElementParseData<DetailsSchema>();
const isOpen = ref(true);

const detailsIcon = await useElementIcon();
const phrase = await useElementPhrases();
</script>

<template>
    <div :class="[$style.details, !isOpen && $style.closed]">
        <header :class="$style.header" @click="isOpen = !isOpen">
            <MyRuntimeIcon
                :class="$style.detailsIcon"
                name="details"
                :svg="detailsIcon"
                :title="phrase('_element_title')"
            />
            <div :class="$style.title">
                {{ meta.title || phrase('_element_title') }}
            </div>
            <button :class="$style.toggleButton">
                <MyRuntimeIcon name="details-toggle" :svg="toggleIcon" />
            </button>
        </header>
        <main :class="$style.main">
            <div :class="$style.content">
                <Render :node="content" />
            </div>
        </main>
    </div>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;

$borderColor: light-dark(#d7d7d7, #333);

.details {
    background: color-mix(
        in srgb,
        light-dark(#f1f1f1, #1b1b1b),
        transparent 50%
    );
    border-radius: 5px;
    border: 2px dashed #{$borderColor};

    .header {
        display: flex;
        align-items: center;
        gap: var(--bitran_gap);
        padding: 10px var(--_bitran_asideWidth);
        color: var(--bitran_textMuted);
        font-weight: 500;
        border-bottom: 2px dashed #{$borderColor};

        @include bitranUtils.transition(border-color);

        .detailsIcon,
        .title,
        .toggleButton {
            flex-shrink: 0;
        }

        .detailsIcon {
            font-size: 1.2em;
            cursor: help;
        }

        .title {
            flex: 1;
        }

        .toggleButton {
            border-radius: 3px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;

            @include bitranUtils.transition(color, background);

            &:hover {
                color: var(--bitran_text);
                background: light-dark(#dbdbdb, #333);
            }

            [my-icon] {
                @include bitranUtils.transition(transform);
                transform: rotate(45deg);
            }
        }
    }

    .main {
        @include bitranUtils.transition(height);
        overflow: hidden;
        height: auto;
        padding-right: var(--_bitran_asideWidth);
    }

    .content {
        padding: 10px 0;
    }

    &.closed {
        > .header {
            border-bottom-color: transparent;
        }

        > .header > .toggleButton [my-icon] {
            transform: rotate(0deg);
        }

        > .main {
            height: 0;
        }
    }
}
</style>
