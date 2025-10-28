<script lang="ts" setup>
import type { ParsedElement } from '../../../element';
import type { ProblemSchema } from '../problem.global';
import ProseBlock from '../../../app/front/components/ProseBlock.vue';

const { element } = defineProps<{ element: ParsedElement<ProblemSchema> }>();

//console.log(element);
</script>

<template>
    <ProseBlock :element>
        <div>Problem</div>
    </ProseBlock>
</template>
