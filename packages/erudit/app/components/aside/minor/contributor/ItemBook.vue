<script lang="ts" setup>
import type { ContributorContributionBook } from '@erudit-js/core/content/contributions';
import ItemContent from './ItemContent.vue';

defineProps<{ book: ContributorContributionBook }>();

const opened = ref(false);
</script>

<template>
  <TreeItem
    :icon="ICONS['book']"
    :main="formatText(book.title)"
    :state="opened ? 'accent' : undefined"
    @click="opened = !opened"
  >
    <template #secondary>
      <MyIcon
        name="plus"
        :class="['transition-[rotate]', opened ? 'rotate-45' : 'rotate-0']"
      />
    </template>
  </TreeItem>
  <div
    :class="['overflow-hidden transition-[height]', opened ? 'h-auto' : 'h-0']"
  >
    <ItemContent
      v-for="content in book.items"
      :content="content"
      :insideBook="true"
    />
  </div>
</template>
