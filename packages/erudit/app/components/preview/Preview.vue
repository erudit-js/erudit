<script lang="ts" setup>
import type { PreviewRequest } from '@app/scripts/preview/request';
import {
    closePreview,
    previewBlinkTrigger,
    previewRequest,
    previewTheme,
    previewVisible,
    unsetPreviewTheme,
} from '@app/scripts/preview/state';

import PreviewScreen from './PreviewScreen.vue';

const height = ref<number>(0);
const request = shallowRef<PreviewRequest>();
const screenKey = ref(0); // Need to change this every time for Vue transition to work
const route = useRoute();

watch(previewRequest, () => {
    if (previewRequest.value) {
        request.value = structuredClone(toRaw(previewRequest.value));
        unsetPreviewTheme();
        screenKey.value++;
    }
});

watch(
    () => route.path,
    () => {
        closePreview();
    },
);
</script>

<template>
    <div :class="$style.previewSticky">
        <div :class="$style.previewOverlay">
            <section
                :class="[$style.preview, previewVisible && $style.visible]"
                :style="{
                    '--_previewHeightInner': `min(${height}px, var(--_previewMaxHeight))`,
                }"
                :data-erudit-preview-theme="previewTheme"
            >
                <TransitionFade>
                    <PreviewScreen
                        v-if="request"
                        :request
                        :key="screenKey"
                        v-model:height="height"
                    />
                </TransitionFade>
                <div
                    :key="previewBlinkTrigger"
                    :class="$style.blinkOverlay"
                ></div>
            </section>
        </div>
    </div>
</template>

<style lang="scss" module>
@use '$/def/z';
@use '$/def/bp';

.previewSticky {
    position: sticky;
    top: 0;
    z-index: z.$preview;
}

.previewOverlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100dvh;
    //background: rgba(255, 0, 0, 0.121);
    overflow: hidden;
    pointer-events: none;
    touch-action: none;
}

.preview {
    --previewBorderRadius: 15px;

    --_previewMaxHeight: 70dvh;
    --_previewHeightInner: 0px;
    --_previewHeight: calc(var(--_previewHeightInner) + 1px /* Top border */);

    pointer-events: initial;
    touch-action: initial;

    overflow: hidden;

    position: absolute;
    bottom: 0;
    height: var(--_previewHeight);
    max-height: var(--_previewMaxHeight);
    width: 100%;
    background: var(--_previewThemeBg, var(--bgAside));

    border: 1px solid var(--_previewThemeBorder, var(--border));
    border-bottom: none;
    border-top-left-radius: var(--previewBorderRadius);
    border-top-right-radius: var(--previewBorderRadius);

    box-shadow: 0px -10px 12px 0px
        light-dark(rgba(black, 0.11), rgba(white, 0.03));

    @include transition(bottom, height, box-shadow, background);

    @media (max-height: 500px) {
        --_previewMaxHeight: 85dvh;
    }

    @include bp.below('aside2') {
        border-right: transparent;
    }
    @include bp.below('aside1') {
        border-left: transparent;
    }

    &:not(.visible) {
        bottom: calc(-1 * var(--_previewHeight));
        box-shadow: none;
        overflow: hidden;
    }
}

.blinkOverlay {
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    touch-action: none;
    background: var(--brand);
    opacity: 0;
    animation: blink 0.5s ease-out;
}

@keyframes blink {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0.6;
    }
    100% {
        opacity: 0;
    }
}

//
// Themes
//

.preview {
    --_previewThemeBg: var(--bgAside);
    --_previewThemeBorder: var(--border);
    --_previewThemeText: var(--text);

    @mixin previewTheme($themeName, $baseColor) {
        &[data-erudit-preview-theme='#{$themeName}'] {
            --_previewThemeBg: color-mix(
                in srgb,
                #{$baseColor},
                var(--bgAside) 92%
            );
            --_previewThemeBorder: color-mix(
                in srgb,
                #{$baseColor},
                var(--border) 80%
            );
            --_previewThemeText: #{$baseColor};
        }
    }

    @include previewTheme(error, var(--error));
    @include previewTheme(warn, var(--warn));
    @include previewTheme(success, var(--success));
    @include previewTheme(brand, var(--brand));
}
</style>
