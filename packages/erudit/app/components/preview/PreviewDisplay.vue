<script lang="ts" setup>
import type { PreviewFooter } from '@app/scripts/preview/footer';
import {
    closePreview,
    hasPreviewHistory,
    showPreviousPreview,
} from '@app/scripts/preview/state';

const { footer } = defineProps<{ footer?: PreviewFooter }>();

const phrase = await usePhrases('close', 'back', 'goto');
</script>

<template>
    <section :class="$style.display">
        <div v-if="$slots.default" :class="$style.content">
            <slot></slot>
        </div>

        <div v-if="footer" :class="$style.footer">
            <div :class="$style.icon" v-if="footer.iconName || footer.iconSvg">
                <MyIcon v-if="footer.iconName" :name="footer.iconName" />
                <MyRuntimeIcon
                    v-else
                    name="preview-footer-icon"
                    :svg="footer.iconSvg!"
                />
            </div>

            <div :class="$style.info">
                <div v-if="footer.secondary" :class="$style.secondary">
                    {{ footer.secondary }}
                </div>
                <div :class="$style.primary">{{ footer.primary }}</div>
            </div>

            <div :class="$style.actions">
                <TransitionFade>
                    <PreviewFooterAction
                        v-if="hasPreviewHistory"
                        icon="arrow-left"
                        @click="showPreviousPreview"
                        :title="phrase.back"
                    />
                </TransitionFade>
                <PreviewFooterAction
                    icon="cross"
                    @click="closePreview"
                    :title="phrase.close"
                />
                <PreviewFooterAction
                    v-if="footer.href"
                    :link="footer.href"
                    icon="arrow-in-text"
                    :brand="true"
                    :title="phrase.goto"
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss" module>
@use '$/partials/preview';

.display {
    --_previewFooterHeight: 0px;

    &:has(> .footer) {
        --_previewFooterHeight: 70px;
    }
}

.content {
    max-height: calc(var(--_previewMaxHeight) - var(--_previewFooterHeight));
    overflow: auto;
    @include scroll;
}

.content + .footer {
    border-top: 1px solid var(--_previewThemeBorder, var(--border));
    @include transition(border);
}

.footer {
    display: flex;
    gap: var(--gap);
    align-items: center;
    height: var(--_previewFooterHeight);
    padding: 0 var(--gap);

    .icon {
        flex-shrink: 0;
        font-size: 30px;
        color: var(--textMuted);

        @include preview.hasTheme() {
            color: color-mix(
                in srgb,
                var(--_previewThemeText),
                var(--textMuted) 30%
            );
        }

        @include transition(color);
    }

    .info {
        flex: 1;
        overflow: hidden;

        .secondary,
        .primary {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            @include transition(color);
        }

        .secondary {
            color: var(--textMuted);
            font-size: 0.775em;
            margin-bottom: -2px;
        }

        .primary {
            font-size: 0.9em;
            font-weight: bold;
            color: var(--_previewThemeText, var(--text));
        }
    }

    .actions {
        flex-shrink: 0;
        display: flex;
        gap: var(--gapSmall);
    }
}
</style>
