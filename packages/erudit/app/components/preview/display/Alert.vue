<script lang="ts" setup>
import type { PreviewDataAlert } from '@app/scripts/preview/data/alert';
import type { PreviewDisplayProps } from '@app/scripts/preview/display';
import type { PreviewFooter } from '@app/scripts/preview/footer';
import { setPreviewTheme } from '@app/scripts/preview/state';

const { data } = defineProps<PreviewDisplayProps<PreviewDataAlert>>();

const phrase = await usePhrases('error');

setPreviewTheme(data.theme!);

const footer: PreviewFooter = {
    iconName: 'alert',
    primary: data.title || phrase.error,
};
</script>

<template>
    <PreviewDisplay :footer>
        <div :class="$style.alertContent">
            <div v-html="data.message"></div>
            <pre v-if="data.pre" v-html="data.pre"></pre>
        </div>
    </PreviewDisplay>
</template>

<style lang="scss" module>
.alertContent {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    padding: var(--gapBig);

    color: var(--_previewThemeText);
    font-size: 0.9em;

    @include transition(color);

    div {
        font-weight: 500;
    }

    pre {
        max-height: 100px;
        overflow: auto;
        @include scroll;
    }
}
</style>
