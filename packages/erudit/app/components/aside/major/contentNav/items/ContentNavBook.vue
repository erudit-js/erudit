<script lang="ts" setup>
import ItemTemplate from './ItemTemplate.vue';

const { navItem } = defineProps<{ navItem: FrontContentNavTopic }>();
const { shortBookId, showBookNav } = inject(asideMajorContentNavSymbol)!;

const active = computed(() => {
    return navItem.shortId === shortBookId.value;
});
</script>

<template>
    <ItemTemplate
        icon="book-outline"
        :navItem
        :state="active ? 'active' : undefined"
        :to="active ? '' : navItem.link"
        @click="showBookNav = true"
    />
</template>
