<script lang="ts" setup>
import { ref, watchEffect } from 'vue';

import type { AccentSchema, AccentSectionSchema } from './schema';
import {
    useArrayContainsAnchor,
    useFormatText,
    type ElementPhrases,
} from '../../app';
import type { ParsedElement } from '../../element';
import type { AccentSectionData } from './data';
import Render from '../../app/front/components/Render.vue';
import Expander from '../../shared/Expander.vue';

const { phrase, sections } = defineProps<{
    phrase: ElementPhrases<any>;
    sections: ParsedElement<AccentSectionSchema<AccentSchema>>[];
}>();

const formatText = useFormatText();
const openedSectionI = ref<number>();
const containsAnchorI = useArrayContainsAnchor(sections);

function getSectionTitle(sectionData: AccentSectionData) {
    let title = '';

    if (sectionData.type === 'suffix') {
        title = phrase[`section_title_${sectionData.suffix}`];
    } else if (sectionData.type === 'custom') {
        title = sectionData.title;
    }

    return formatText(title);
}

watchEffect(() => {
    if (containsAnchorI.value !== undefined) {
        openedSectionI.value = containsAnchorI.value;
    }
});
</script>

<template>
    <div
        :class="[
            `flex flex-wrap items-center gap-(--proseAsideWidth) border-b
            p-(--proseAsideWidth) transition-[border]`,
            openedSectionI === undefined
                ? 'border-transparent'
                : 'border-(--accentBorder)',
        ]"
    >
        <button
            v-for="(section, i) of sections"
            @click="openedSectionI = i === openedSectionI ? undefined : i"
            :class="[
                `text-main-sm micro:py-[8px] micro:px-[10px] cursor-pointer
                rounded-xl px-[8px] py-[6px] font-medium
                transition-[color,background]`,
                i === openedSectionI
                    ? 'bg-(--accentText)/80 text-white'
                    : `hocus:bg-(--accentText)/30 bg-(--accentText)/15
                        text-(--accentText)`,
            ]"
        >
            {{ getSectionTitle(section.data) }}
        </button>
    </div>
    <Expander>
        <div v-if="openedSectionI !== undefined" class="py-(--proseAsideWidth)">
            <Render
                v-for="child of sections[openedSectionI].children"
                :element="child"
            />
        </div>
    </Expander>
</template>
