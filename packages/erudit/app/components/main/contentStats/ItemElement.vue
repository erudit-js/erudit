<script lang="ts" setup>
import Item from './Item.vue';

const { schemaName } = defineProps<{
    schemaName: string;
    count: number;
}>();

const elementIcon = await getElementIcon(schemaName);
const elementPhrase = await getElementPhrase(schemaName);
</script>

<template>
    <Item
        :icon="elementIcon"
        :label="elementPhrase.element_name"
        :count="count"
    />
</template>
