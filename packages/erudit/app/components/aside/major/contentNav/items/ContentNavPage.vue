<script lang="ts" setup>
import ItemTemplate from './ItemTemplate.vue';

const { navItem } = defineProps<{ navItem: FrontContentNavTopic }>();
const { shortContentId } = useContentId();

const active = computed(() => {
  return navItem.shortId === shortContentId.value;
});
</script>

<template>
  <ItemTemplate icon="lines" :navItem :state="active ? 'active' : undefined" />
</template>
