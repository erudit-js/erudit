<script lang="ts" setup>
import type { ParsedElement } from '../../../element';
import type { ProblemsSchema } from '../problems.global';
import ProseBlock from '../../../app/front/components/ProseBlock.vue';

const { element } = defineProps<{ element: ParsedElement<ProblemsSchema> }>();

//console.log(element);
</script>

<template>
    <ProseBlock :element>
        <div>Problems</div>
    </ProseBlock>
</template>
