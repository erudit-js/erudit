<script setup lang="ts">
import type { ToProseElement } from 'tsprose';

import { type ProblemSchema } from '../problem.js';
import Block from '../../../app/shared/block/Block.vue';
import ProblemContainer from './ProblemContainer.vue';
import ProblemHeader from './ProblemHeader.vue';
import ProblemContent from './ProblemContent.vue';

const { element } = defineProps<{
  element: ToProseElement<ProblemSchema>;
}>();
</script>

<template>
  <Block :element>
    <ProblemContainer>
      <ProblemHeader :info="element.data.info" />
      <ProblemContent :element :initialElements="element.children" />
    </ProblemContainer>
  </Block>
</template>
