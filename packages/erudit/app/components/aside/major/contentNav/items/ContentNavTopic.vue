<script lang="ts" setup>
import ItemTemplate from './ItemTemplate.vue';

const { navItem } = defineProps<{ navItem: FrontContentNavTopic }>();
const { shortContentId } = inject(asideMajorContentNavSymbol)!;

const active = computed(() => {
    return navItem.shortId === shortContentId.value;
});
</script>

<template>
    <ItemTemplate
        icon="lines-array"
        :navItem
        :state="active ? 'active' : undefined"
    />
</template>
