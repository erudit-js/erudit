<script lang="ts" setup>
import type { MyIconName } from '#my-icons';
import Flags from './Flags.vue';

const { navItem, to } = defineProps<{
  navItem: FrontContentNavItem;
  icon?: MyIconName;
  state: undefined | 'active' | 'accent';
  to?: string;
}>();

const resolvedTo = computed(() => {
  if (to === '') {
    return undefined;
  }

  return to ?? navItem.link;
});
</script>

<template>
  <TreeItem :icon :main="formatText(navItem.title)" :state :to="resolvedTo">
    <template v-slot:secondary v-if="navItem.flags">
      <Flags :flags="navItem.flags" />
    </template>
  </TreeItem>
</template>
