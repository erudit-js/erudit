<script lang="ts" setup>
import {
    useElementParseData,
    useElementRenderData,
    Render,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import { contentAsset } from '#imports';
import type { CalloutSchema } from './shared';

// Default icons
import jokeSvg from './assets/joke.svg?no-inline';
import quoteSvg from './assets/quote.svg?no-inline';

defineProps<ElementProps<CalloutSchema>>();

const defaultIcons = {
    joke: jokeSvg,
    quote: quoteSvg,
};

const parseData = useElementParseData<CalloutSchema>();
const renderData = useElementRenderData<CalloutSchema>();

const iconSrc = (() => {
    if (parseData.icon.type === 'default')
        return defaultIcons[
            parseData.icon.calloutType as keyof typeof defaultIcons
        ];

    return contentAsset(renderData);
})();

const iconInversion = (() => {
    if (parseData.icon.type === 'custom' && parseData.icon.invert) {
        return parseData.icon.invert;
    }
    return undefined;
})();
</script>

<template>
    <div :class="$style.callout">
        <div :class="$style.iconContainer">
            <div :class="$style.iconWrapper">
                <img
                    :class="[
                        $style.icon,
                        iconInversion ? $style[`invert-${iconInversion}`] : '',
                    ]"
                    :src="iconSrc"
                    loading="lazy"
                />
                <div :class="$style.arrow">
                    <div :class="$style.fill"></div>
                </div>
            </div>
        </div>
        <div :class="$style.contentContainer">
            <header>
                <img
                    :src="iconSrc"
                    :class="
                        iconInversion ? $style[`invert-${iconInversion}`] : ''
                    "
                    loading="lazy"
                />
                <span>{{ parseData.title }}</span>
            </header>
            <div class="bitran-blocks">
                <Render :node="parseData.content" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/bp' as bitranBp;

.callout {
    --arrowSize: 16px;
    --borderColor: var(--bitran_colorBorder);
    --bgColor: light-dark(#f7f7f7, #1c1c1c);
    --gap: calc(var(--bitran_gap) + 10px);

    display: flex;
    position: relative;
    gap: var(--gap);

    .iconContainer {
        flex-shrink: 0;

        @include bitranBp.below('mobile') {
            display: none;
        }
    }

    .contentContainer {
        flex: 1;

        border: 1px solid var(--borderColor);
        background-color: var(--bgColor);
        padding: var(--_bitran_asideWidth) 0;
        padding-right: var(--_bitran_asideWidth);
        border-radius: 5px;
        position: relative;

        font-family: var(--bitran_fontAlt);
        font-size: 0.92em;

        header {
            display: flex;
            align-items: center;
            gap: var(--bitran_gapSmall);
            padding-left: var(--_bitran_asideWidth);
            margin-bottom: var(--bitran_gap);

            img {
                flex-shrink: 0;
                width: 30px;
                aspect-ratio: 1;
                border-radius: 50%;

                @include bitranBp.above('mobile') {
                    display: none;
                }
            }

            span {
                font-weight: 600;
                color: var(--bitran_textDeep);
            }
        }
    }
}

.iconWrapper {
    border-radius: 50%;
    border: 2px solid var(--bitran_colorBorder);
    position: relative;

    .icon {
        display: block;
        width: 60px;
        aspect-ratio: 1;
        border-radius: 50%;
        border: 2px solid var(--bgMain);
    }

    .arrow {
        position: absolute;
        z-index: 1;

        top: 50%;
        right: calc(-2.8px - var(--gap));
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-top: var(--arrowSize) solid transparent;
        border-bottom: var(--arrowSize) solid transparent;
        border-right: var(--arrowSize) solid var(--borderColor);

        .fill {
            position: absolute;
            z-index: 1;
            left: 1.5px;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-top: calc(var(--arrowSize) - 1px) solid transparent;
            border-bottom: calc(var(--arrowSize) - 1px) solid transparent;
            border-right: calc(var(--arrowSize) - 1px) solid var(--bgColor);
        }
    }
}

:root[data-theme='light'] {
    .invert-light {
        filter: invert(1);
    }
}

:root[data-theme='dark'] {
    .invert-dark {
        filter: invert(1);
    }
}
</style>
