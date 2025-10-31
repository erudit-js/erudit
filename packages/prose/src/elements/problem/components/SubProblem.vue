<script lang="ts" setup>
import { useElementStorage } from '../../../app/front/composables/elementStorage';
import type { ParsedElement } from '../../../element';
import type { SubProblemSchema } from '../problems.global';
import ProblemContent from './ProblemContent.vue';

const { element } = defineProps<{ element: ParsedElement<SubProblemSchema> }>();
const subProblemStorage = await useElementStorage<SubProblemSchema>(element);
</script>

<template>
    <ProblemContent
        :initialElements="element.children"
        :generatorUrl="subProblemStorage?.generatorUrl"
    />
</template>
