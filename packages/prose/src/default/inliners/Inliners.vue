<script lang="ts" setup>
import type { ParsedElement } from '../../element';
import type { InlinersSchema } from '.';
import Render from '../../app/front/components/Render.vue';

const { element } = defineProps<{ element: ParsedElement<InlinersSchema> }>();

console.log(
    '====================================================================',
);
console.log(element);
</script>

<template>
    <Render v-for="child of element.children" :element="child" />
</template>
