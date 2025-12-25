<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import type { subProblemSchema } from '../problems.js';
import ProblemContent from './ProblemContent.vue';

const { element } = defineProps<{
    element: ProseElement<typeof subProblemSchema>;
}>();
</script>

<template>
    <ProblemContent :element :initialElements="element.children" />
</template>
