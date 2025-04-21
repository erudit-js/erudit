<script lang="ts" setup>
import { ref } from 'vue';
import { injectFormatText } from '@bitran-js/renderer-vue';

const switchSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="M294.5,44.5c0-21.3-17.2-38.5-38.5-38.5s-38.5,17.2-38.5,38.5v173.1H44.5c-21.3,0-38.5,17.2-38.5,38.5s17.2,38.5,38.5,38.5h173.1v173.1c0,21.3,17.2,38.5,38.5,38.5s38.5-17.2,38.5-38.5v-173.1h173.1c21.3,0,38.5-17.2,38.5-38.5s-17.2-38.5-38.5-38.5h-173.1V44.5Z"/>
</svg>
`;

defineProps<{
    label: string;
}>();

const pretty = injectFormatText();
const isOpen = ref(false);
</script>

<template>
    <section :class="{ [$style.expander]: true, [$style.opened]: isOpen }">
        <header @click="isOpen = !isOpen" :class="$style.header">
            {{ pretty(label) }}
            <button :class="$style.switch">
                <MyRuntimeIcon name="expander-switch" :svg="switchSvg" />
            </button>
        </header>
        <main :class="$style.main">
            <div :class="$style.content">
                <slot></slot>
            </div>
        </main>
    </section>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;

.expander {
    --_expander_borderColor: var(--bitran_colorBorder);
    --_expander_textColor: var(--bitran_text);
    --_expander_gapX: var(--_bitran_asideWidth);
    --_expander_gapY: var(--bitran_gap);

    //
    //
    //

    border-top: 1px solid var(--_expander_borderColor);

    .header {
        font-weight: 600;
        color: var(--_expander_textColor);
        padding: var(--_expander_gapY) var(--_expander_gapX);
        border-bottom: 1px dashed transparent;
        display: flex;
        align-items: center;
        cursor: pointer;

        @include bitranUtils.transition(border-color);

        .switch {
            margin-left: auto;
            border-radius: 3px;
            background: transparent;
            border: none;
            padding: 5px;

            @include bitranUtils.transition(color, background);

            [my-icon] {
                display: flex;
                transform: rotate(0deg);
                @include bitranUtils.transition(transform);
            }
        }

        &:hover .switch {
            background: color-mix(
                in srgb,
                var(--_expander_textColor),
                transparent 85%
            );
        }
    }

    .main {
        overflow: hidden;
        height: 0;
        @include bitranUtils.transition(height);
    }

    &.opened {
        .header {
            border-bottom-color: var(--_expander_borderColor);
        }

        .switch [my-icon] {
            transform: rotate(45deg);
        }

        .main {
            height: auto;
        }
    }
}
</style>
