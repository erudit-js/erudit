<script lang="ts" setup>
import type { ISchema } from '.';
import type { ParsedElement } from '../../element';
import Render from '../../app/front/components/Render.vue';

defineProps<{ element: ParsedElement<ISchema> }>();
</script>

<template>
    <i><Render v-for="child of element.children" :element="child" /></i>
</template>
