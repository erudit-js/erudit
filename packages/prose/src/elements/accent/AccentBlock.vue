<script setup lang="ts">
import { inject, shallowRef } from 'vue';

import {
    type AccentSectionSchema,
    type AccentBlockSchema,
    type AccentSchema,
} from './schema';
import { getAccentContext } from './appDefinition';
import type { ParsedElement } from '../../element';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Render from '../../app/front/components/Render.vue';
import { useAppElement } from '../../app/front/composables/appElement';
import { proseContextSymbol, useElementIcon } from '../../app';
import { useElementPhrase } from '../../app/front/composables/elementPhrase';
import AccentSectionsColumn from './AccentSectionsColumn.vue';
import AccentSectionsRow from './AccentSectionsRow.vue';

const { element } = defineProps<{
    element: ParsedElement<AccentBlockSchema<AccentSchema>>;
}>();

const { MaybeMyIcon, formatText } = inject(proseContextSymbol)!;

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
            :style="{
                '--accentText': accentContext.colors.text,
                '--accentBackground': accentContext.colors.background,
                '--accentBorder': accentContext.colors.border,
            }"
            :class="[
                `rounded-xl border border-(--accentBorder)
                bg-(--accentBackground) transition-[background,border]`,
                { 'pb-normal': !hasSections },
            ]"
        >
            <div
                class="py-normal gap-normal flex items-center
                    px-(--proseAsideWidth) font-semibold text-(--accentText)
                    transition-[color]"
            >
                <MaybeMyIcon :name="accentIcon" class="shrink-0" />
                <span>{{ formatText(element.data.title) }}</span>
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
