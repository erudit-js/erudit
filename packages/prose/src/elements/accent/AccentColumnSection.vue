<script lang="ts" setup>
import { nextTick, onMounted, ref, watchEffect } from 'vue';

import { useIcon } from '../../app/front/composables/icon';
import {
    useAnchorResolving,
    useContainsAnchor,
    useFormatText,
    type ElementPhrases,
} from '../../app';
import type { ParsedElement } from '../../element';
import type { AccentSectionData } from './data';
import type { AccentSectionSchema, AccentSchema } from './schema';
import Render from '../../app/front/components/Render.vue';
import plusIcon from '../../app/front/assets/plus.svg?raw';
import Expander from '../../app/front/components/Expander.vue';

const { phrase, section } = defineProps<{
    phrase: ElementPhrases<any>;
    section: ParsedElement<AccentSectionSchema<AccentSchema>>;
}>();

const opened = ref(false);
const instant = ref(false);
const Icon = useIcon();
const formatText = useFormatText();
const containsAnchor = useContainsAnchor(section);
const anchorResolving = useAnchorResolving();

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
    if (containsAnchor.value) {
        instant.value = anchorResolving.value;
        opened.value = true;
    }
});
</script>

<template>
    <div>
        <div
            @click="opened = !opened"
            class="group relative flex cursor-pointer items-center border-t
                border-(--accentBorder) p-(--proseAsideWidth) font-medium
                text-(--accentText) transition-[border]"
        >
            <div class="flex-1">{{ getSectionTitle(section.data) }}</div>
            <button
                class="group-hocus:bg-(--accentBorder)/70 shrink-0 rounded
                    bg-transparent p-[5px] transition-[background]"
            >
                <Icon
                    :name="plusIcon"
                    :class="['transition-[rotate]', opened ? 'rotate-45' : '']"
                />
            </button>
            <!-- Section header bottom border -->
            <div
                :class="[
                    `absolute bottom-0 left-0 w-full border-b border-dashed
                    transition-[border]`,
                    opened ? 'border-(--accentBorder)' : 'border-transparent',
                ]"
            ></div>
        </div>
        <Expander :instant>
            <div class="py-(--proseAsideWidth)" v-if="opened">
                <Render v-for="child of section.children" :element="child" />
            </div>
        </Expander>
    </div>
</template>
