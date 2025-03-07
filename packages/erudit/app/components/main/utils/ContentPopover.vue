<script lang="ts" setup>
import { useFloating, autoUpdate, arrow, shift } from '@floating-ui/vue';

import type { PopoverData } from '@shared/popover';
import { isMyIcon } from '#my-icons';

defineProps<{ data: PopoverData }>();

const referenceElement = useTemplateRef('reference');
const popoverElement = useTemplateRef('popover');
const arrowElement = useTemplateRef('popover-arrow');

const { floatingStyles, middlewareData } = useFloating(
    referenceElement,
    popoverElement,
    {
        whileElementsMounted: autoUpdate,
        middleware: [
            shift({
                boundary: document?.querySelector('[erudit-main]') || undefined,
                padding: 15,
            }),
            arrow({ element: arrowElement }),
        ],
    },
);

const popoverVisible = ref(false);

const showDelay = 400;
const hideDelay = 100;
let showTimeout: any;
let hideTimeout: any;

function showPopover(immediate?: boolean) {
    clearTimeout(hideTimeout);
    clearTimeout(showTimeout);

    if (immediate) {
        popoverVisible.value = true;
    } else {
        showTimeout = setTimeout(() => {
            popoverVisible.value = true;
        }, showDelay);
    }
}

function hidePopover() {
    clearTimeout(showTimeout);
    hideTimeout = setTimeout(() => {
        popoverVisible.value = false;
    }, hideDelay);
}
</script>

<template>
    <div
        ref="reference"
        :class="$style.reference"
        :style="`--popoverColor: ${data.color}`"
        @mouseenter="() => showPopover()"
        @mouseleave="hidePopover"
        @click="() => showPopover(true)"
    >
        <MyIcon v-if="isMyIcon(data.icon)" :name="data.icon as any" />
        <MyRuntimeIcon v-else name="popover-icon" :svg="data.icon" />

        {{ data.title }}

        <TransitionFade>
            <div
                v-if="popoverVisible"
                ref="popover"
                :class="$style.popover"
                :style="floatingStyles"
            >
                <div
                    ref="popover-arrow"
                    :class="$style.arrow"
                    :style="{
                        position: 'absolute',
                        top:
                            middlewareData.arrow?.y != null
                                ? `${middlewareData.arrow.y}px`
                                : '',
                        left:
                            middlewareData.arrow?.x != null
                                ? `${middlewareData.arrow.x}px`
                                : '',
                    }"
                ></div>

                <div :class="$style.inner">
                    <MyIcon
                        :class="$style.floatIcon"
                        v-if="isMyIcon(data.icon)"
                        :name="data.icon as any"
                    />
                    <MyRuntimeIcon
                        :class="$style.floatIcon"
                        v-else
                        name="popover-icon"
                        :svg="data.icon"
                    />

                    <div :class="$style.title">{{ data.title }}</div>
                    <div v-if="data.description">{{ data.description }}</div>

                    <slot></slot>
                </div>
            </div>
        </TransitionFade>
    </div>
</template>

<style lang="scss" module>
.reference {
    --_baseColor: color-mix(in srgb, var(--popoverColor), var(--invert) 35%);
    --_bgColor: color-mix(in srgb, var(--popoverColor), var(--bgAside) 85%);
}

.reference {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: var(--gapSmall);
    padding: var(--gapSmall);

    background: var(--_bgColor);
    color: var(--_baseColor);
    font-size: 0.9em;
    line-height: 0;

    border: 1px solid var(--_baseColor);
    border-radius: 3px;
    cursor: help;
}

.popover {
    cursor: auto;

    position: absolute;
    z-index: 999;
    min-width: 300px;
    max-width: 320px;
    padding-top: var(--gap);
    line-height: normal;

    .arrow {
        position: absolute;
        top: 14px;
        left: 0;
        background: var(--_baseColor);
        width: 32px;
        height: 32px;
        transform: rotate(45deg);
    }

    .inner {
        position: relative;
        z-index: 1;
        box-shadow: 0 0 18px
            color-mix(
                in srgb,
                color-mix(in srgb, var(--popoverColor), var(--invert) 50%),
                transparent 70%
            );
        padding: var(--gapSmall);
        border: 2px solid var(--_baseColor);
        border-radius: 3px;
        background: linear-gradient(45deg, var(--bgAside), var(--_bgColor) 70%);

        font-size: 0.9em;

        .floatIcon {
            float: right;
            margin: 5px 5px 10px 10px;
            font-size: 30px;
            opacity: 0.3;
        }

        .title {
            font-weight: 600;
            margin-bottom: var(--gapSmall);
        }
    }
}
</style>
