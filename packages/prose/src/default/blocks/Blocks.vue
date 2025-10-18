<script lang="ts" setup>
import type { ParsedElement } from '../../element';
import type { BlocksSchema } from '.';
import Render from '../../app/front/components/Render.vue';

defineProps<{ element: ParsedElement<BlocksSchema> }>();
</script>

<template>
    <Render v-for="child of element.children" :element="child" />
</template>
