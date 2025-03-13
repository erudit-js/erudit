<script setup lang="ts">
import { ref } from 'vue';
import {
    Render,
    useElementIcon,
    useElementParseData,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import type { DetailsSchema } from './shared';
import { MyRuntimeIcon } from '#components';

defineProps<ElementProps<DetailsSchema>>();
const content = useElementParseData<DetailsSchema>();
const isOpen = ref(true);

const toggleDetails = () => {
    isOpen.value = !isOpen.value;
};

const detailsIcon = await useElementIcon();
</script>

<template>
    <div :class="$style.details">
        <header :class="$style.header" @click="toggleDetails">
            <MyRuntimeIcon name="details" :svg="detailsIcon" />
            <span>Шапка</span>
            <button :class="$style.toggleButton">
                <span :class="[$style.arrow, isOpen ? $style.up : $style.down]"
                    >▼</span
                >
            </button>
        </header>
        <main :class="[$style.main, { [$style.closed]: !isOpen }]">
            <div :class="$style.content">
                <Render :node="content" />
            </div>
        </main>
    </div>
</template>

<style lang="scss" module>
.details {
    background: light-dark(#f1f1f1, #1b1b1b);
    border-radius: 5px;
    border: 2px dashed light-dark(#d7d7d7, #333);

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;
        user-select: none;
    }

    .toggleButton {
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
    }

    .arrow {
        display: inline-block;
        transition: transform 0.3s ease;

        &.up {
            transform: rotate(180deg);
        }

        &.down {
            transform: rotate(0deg);
        }
    }

    .main {
        @include transition(height);
        overflow: hidden;
        height: auto;

        &.closed {
            height: 0;
        }
    }

    .content {
        padding: 10px;
    }
}
</style>
