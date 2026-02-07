<script lang="ts" setup>
import { shallowRef } from 'vue';
import { type ProseElement } from '@jsprose/core';

import {
  isAccentMainElement,
  type AccentMainSchema,
  type AccentSchema,
  type AccentSectionSchema,
} from './core.js';
import { accentSectionNamePhrase, type AccentAppOptions } from './app.js';
import { useAppElement } from '../../app/composables/appElement.js';
import { useElementPhrase } from '../../app/composables/language.js';
import { useElementIcon } from '../../app/composables/elementIcon.js';
import { useProseContext, type ElementPhrases } from '../../app/index.js';
import { useFormatText } from '../../app/composables/formatText.js';
import Block from '../../app/shared/block/Block.vue';
import Render from '../../app/shared/Render.vue';
import AccentColumnSection from './AccentColumnSection.vue';
import AccentRowSections from './AccentRowSections.vue';

const { element } = defineProps<{ element: ProseElement<AccentSchema> }>();

const { EruditIcon } = useProseContext();
const formatText = useFormatText();
const appElement = useAppElement(element);
const accentIcon = await useElementIcon(element);
const phrase =
  await useElementPhrase<ElementPhrases<Record<string, string>>>(element);

const mainSection = shallowRef<ProseElement<AccentMainSchema>>();
const sections = shallowRef<ProseElement<AccentSectionSchema>[]>([]);

for (const child of element.children) {
  if (isAccentMainElement(child)) {
    mainSection.value = child;
  } else {
    sections.value.push(child);
  }
}

const sectionTitles = sections.value.map((section) => {
  if (section.data.type === 'manual') {
    return formatText(section.data.title);
  }

  return formatText(phrase[accentSectionNamePhrase(section.data.name)]);
});

const accentOptions = (appElement as any)['accent'] as AccentAppOptions;
</script>

<template>
  <Block :element>
    <div
      :style="{
        '--accentText': accentOptions.colors.text,
        '--accentBackground': accentOptions.colors.background,
        '--accentBorder': accentOptions.colors.border,
      }"
      :class="[
        'rounded-xl border border-(--accentBorder) bg-(--accentBackground)',
      ]"
      data-prose-accent
    >
      <div
        class="text-main-lg flex items-center gap-(--proseAsideWidth)
          px-(--proseAsideWidth) py-(--proseAsideWidth) font-semibold
          text-(--accentText)"
      >
        <EruditIcon :name="accentIcon" class="-mr-1 shrink-0 text-[1.3em]" />
        <h2>{{ formatText(element.data.title) }}</h2>
      </div>
      <div class="pb-(--proseAsideWidth)">
        <Render
          v-for="sectionChild of mainSection!.children"
          :element="sectionChild"
        />
      </div>
      <AccentColumnSection
        v-if="element.data.layout === 'column'"
        v-for="(section, i) of sections"
        :section
        :title="sectionTitles[i]"
      />
      <AccentRowSections v-else :sections :sectionTitles />
    </div>
  </Block>
</template>
