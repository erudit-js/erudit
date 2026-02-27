<script lang="ts" setup>
import { topicParts } from '@erudit-js/core/content/topic';

import ItemTemplate from './ItemTemplate.vue';

const { navItem } = defineProps<{ navItem: FrontContentNavTopic }>();
const { shortContentId } = useContentId();

const active = computed(() => {
  return navItem.shortId === shortContentId.value;
});

const topicIcon = computed(() => {
  // Article > Summary > Practice
  if (navItem.parts?.length) {
    for (const part of topicParts) {
      if (navItem.parts.includes(part)) return ICONS[part];
    }
  }
});
</script>

<template>
  <ItemTemplate
    :icon="topicIcon"
    :navItem
    :state="active ? 'active' : undefined"
  />
</template>
