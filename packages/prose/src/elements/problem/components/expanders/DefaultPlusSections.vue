<script lang="ts" setup>
import { isProseElement, type ProseElement } from 'tsprose';

import { problemSectionSchema } from '../../problemContent.js';
import ProblemExpander from '../ProblemExpander.vue';
import ProblemExpanderSection from '../ProblemExpanderSection.vue';
import Render from '../../../../app/shared/Render.vue';

const { value } = defineProps<{ value: ProseElement }>();

const defaultBlocks = value.children!.filter(
  (element) => !isProseElement(element, problemSectionSchema),
);

const sections = value.children!.filter((element) =>
  isProseElement(element, problemSectionSchema),
);
</script>

<template>
  <ProblemExpander>
    <div v-if="defaultBlocks.length" class="py-(--proseAsideWidth)">
      <Render v-for="child of defaultBlocks" :element="child" />
    </div>
    <ProblemExpanderSection
      v-if="sections.length"
      v-for="section of sections"
      :title="section.data"
      :element="section"
    />
  </ProblemExpander>
</template>
