<script lang="ts" setup>
import { h } from 'vue';
import {
    useElementParseData,
    Render,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import type { ListSchema } from './shared';

defineProps<ElementProps<ListSchema>>();
const parseData = useElementParseData<ListSchema>();
const ListComponent = h(parseData.type);
</script>

<template>
    <component :is="ListComponent" :class="$style.list">
        <li v-for="(item, index) in parseData.items" :key="index">
            <div :class="[$style.marker]">
                <div :class="$style.line"></div>
                <div :class="$style.markerContent">
                    <template v-if="parseData.type === 'ol'">
                        {{ parseData.start + index }}
                    </template>
                    <template v-else>
                        <div :class="$style.dot"></div>
                    </template>
                </div>
            </div>
            <div :class="$style.blocks">
                <Render :node="item" />
            </div>
        </li>
    </component>
</template>

<style lang="scss" module>
.list {
    --listBorder: var(--accentColor_border, light-dark(#d7d7d7, #3a3a3a));
    --markerColor: var(--accentColor_text, var(--bitran_textMuted));
    --markerBackground: light-dark(
        color-mix(in hsl, var(--accentColor_background, #ffffff), black 8%),
        color-mix(in hsl, var(--accentColor_background, #1b1b1b), white 8%)
    );

    display: flex;
    flex-direction: column;
    gap: var(--bitran_gap);

    list-style: none;
    padding: 0;
    margin: 0;

    > li {
        display: flex;
        position: relative;

        > .marker {
            position: relative;
            flex-shrink: 0;

            > .line {
                position: absolute;
                z-index: 0;
                top: 0;
                bottom: 0;
                left: calc(50% - 1px);
                width: 0;
                border-left: 1.5px solid var(--listBorder);
            }

            .markerContent {
                position: relative;
                z-index: 1;

                width: 1.8em;
                height: 1.8em;
                border-radius: 50%;
                background: var(--markerBackground);
                border: 1px solid var(--listBorder);

                display: flex;
                justify-content: center;
                align-items: center;

                line-height: 0;
                font-size: 0.75em;
                font-weight: bold;
                color: var(--markerColor);

                .dot {
                    width: 0.5em;
                    height: 0.5em;
                    border-radius: 50%;
                    background: var(--markerColor);
                    opacity: 0.75;
                }
            }
        }

        > .blocks {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--bitran_gap);
            min-width: 0;

            :global(.bitran-blockFloat) {
                display: none;
            }

            :global(.bitran-paragraph) {
                text-align: left;
                margin-top: -1px;
                margin-bottom: -5px;
            }
        }
    }
}
</style>
