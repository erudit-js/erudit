<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import type { subProblemSchema } from '../problems.js';
import ProblemContent from './ProblemContent.vue';

defineProps<{ element: ProseElement<typeof subProblemSchema> }>();
</script>

<template>
    <ProblemContent
        :scriptUrl="element.data.script"
        :initialElements="element.children"
    />
</template>
