<script lang="ts" setup>
import ItemTemplate from './ItemTemplate.vue';

const { navItem } = defineProps<{ navItem: FrontContentNavTopic }>();
const { shortBookId } = useContentId();
const asideMajorPane = useAsideMajorPane();

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
        @click="asideMajorPane = AsideMajorPane.BookNav"
    />
</template>
