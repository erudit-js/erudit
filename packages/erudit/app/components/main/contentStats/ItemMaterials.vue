<script lang="ts" setup>
import Item from './Item.vue';

defineProps<{ count: number }>();

const phrase = await usePhrases('materials');
</script>

<template>
    <Item icon="files" :label="phrase.materials" :count="count" />
</template>
