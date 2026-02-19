<script lang="ts" setup>
import type { ToProseElement } from 'tsprose';
import type { SubProblemSchema } from '../problems.js';
import ProblemContent from './ProblemContent.vue';

const { element } = defineProps<{
  element: ToProseElement<SubProblemSchema>;
}>();
</script>

<template>
  <ProblemContent :element :initialElements="element.children" />
</template>
