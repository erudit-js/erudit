<script lang="ts" setup>
import {
    useElementIcon,
    useElementParseData,
    useElementPhrases,
    useElementRenderData,
    Render,
    type ElementProps,
    useElementLanguage,
} from '@bitran-js/renderer-vue';

import type { AccentSchema } from '../shared';

import ColumnSections from './ColumnSections.vue';
import RowSections from './RowSections.vue';

defineProps<ElementProps<AccentSchema>>();
const parseData = useElementParseData<AccentSchema>();
const renderData = useElementRenderData<AccentSchema>();
const mainNode = parseData.main;
const accentIcon = await useElementIcon();

const elementLanguage = await useElementLanguage();
const phrase = await useElementPhrases();

const resolvedSections = (() => {
    if (parseData.type !== 'complex') return [];

    return parseData.sections.map((section) => {
        const newSection = { ...section };

        const phraseKey = `_section_${newSection.id}`;

        if (phraseKey in elementLanguage) {
            newSection.title = phrase(phraseKey as any);
        }

        return newSection;
    });
})();

const accentColors = Object.keys(renderData.colors).reduce(
    (styles, key) => {
        const colorKey = key as keyof typeof renderData.colors;
        styles[`--accentColor_${colorKey}`] = renderData.colors[colorKey];
        return styles;
    },
    {} as Record<string, string>,
);
</script>

<template>
    <div :class="$style.accent" :style="accentColors">
        <header>
            <MyRuntimeIcon name="accent-icon" :svg="accentIcon" />
            <span>{{ parseData.title || phrase('_element_title') }}</span>
        </header>

        <main v-if="mainNode" :class="$style.content">
            <Render :node="mainNode" />
        </main>

        <template v-if="parseData.type === 'complex'">
            <RowSections
                v-if="parseData.direction === 'row'"
                :sections="resolvedSections"
            />
            <ColumnSections v-else :sections="resolvedSections" />
        </template>
    </div>
</template>

<style lang="scss" module>
.accent {
    border-radius: 10px;
    background: var(--accentColor_background);
    border: 1px solid var(--accentColor_border);

    :global(.accent) {
        color: var(--accentColor_text);
    }

    > header {
        display: flex;
        align-items: center;
        gap: var(--bitran_gap);
        padding: var(--_bitran_asideWidth);

        font-size: 1.1em;
        font-weight: 600;
        color: var(--accentColor_text);

        [my-icon] {
            flex-shrink: 0;
            font-size: 1.18em;
        }
    }

    .content {
        padding-right: var(--_bitran_asideWidth);
        padding-bottom: var(--_bitran_asideWidth);
    }

    .sections {
        color: red;
    }
}
</style>
