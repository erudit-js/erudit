<script setup lang="ts">
import { shallowRef } from 'vue';

import {
    type AccentSectionSchema,
    type AccentBlockSchema,
    type AccentSchema,
} from './schema';
import { getAccentContext } from './appDefinition';
import type { ParsedElement } from '../../element';

import { useAppElement } from '../../app/front/composables/appElement';
import { useElementIcon, useFormatText } from '../../app';
import { useElementPhrase } from '../../app/front/composables/elementPhrase';
import { useIcon } from '../../app/front/composables/icon';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Render from '../../app/front/components/Render.vue';
import AccentSectionsColumn from './AccentSectionsColumn.vue';
import AccentSectionsRow from './AccentSectionsRow.vue';

const { element } = defineProps<{
    element: ParsedElement<AccentBlockSchema<AccentSchema>>;
}>();

const Icon = useIcon();
const formatText = useFormatText();
const appElement = await useAppElement(element);
const accentIcon = await useElementIcon(element);
const accentContext = getAccentContext(appElement);

const mainSection =
    shallowRef<ParsedElement<AccentSectionSchema<AccentSchema>>>();

const restSections = shallowRef<
    ParsedElement<AccentSectionSchema<AccentSchema>>[]
>([]);

for (const child of element.children) {
    if (child.data.type === 'main') {
        mainSection.value = child;
        continue;
    }

    restSections.value.push(child);
}

const hasSections = restSections.value.length > 0;

const SectionsComponent = (() => {
    return element.data.direction === 'column'
        ? AccentSectionsColumn
        : AccentSectionsRow;
})();

const phrase = await useElementPhrase(element);
</script>

<template>
    <ProseBlock :element>
        <div
            data-prose-accent
            :style="{
                '--accentText': accentContext.colors.text,
                '--accentBackground': accentContext.colors.background,
                '--accentBorder': accentContext.colors.border,
            }"
            :class="[
                `rounded-xl border border-(--accentBorder)
                bg-(--accentBackground) transition-[background,border]`,
                { 'pb-(--proseAsideWidth)': !hasSections },
            ]"
        >
            <div
                class="text-main-lg flex items-center gap-(--proseAsideWidth)
                    px-(--proseAsideWidth) py-(--proseAsideWidth) font-semibold
                    text-(--accentText) transition-[color]"
            >
                <Icon :name="accentIcon" class="shrink-0" />
                <h2>{{ formatText(element.data.title) }}</h2>
            </div>
            <div>
                <Render
                    v-for="sectionChild of mainSection!.children"
                    :element="sectionChild"
                />
            </div>
            <SectionsComponent
                v-if="hasSections"
                :sections="restSections"
                :phrase
            />
        </div>
    </ProseBlock>
</template>
