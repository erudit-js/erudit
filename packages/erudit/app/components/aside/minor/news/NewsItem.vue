<script lang="ts" setup>
import { walkPreSync } from 'tsprose';
import RenderNewsElement from './RenderNewsElement.vue';

const { item, isNew } = defineProps<{
  item: NewsItem;
  isNew?: boolean;
}>();

const itemDate = new Date(item.date);
const now = new Date();

const isWithinThreeMonths = (() => {
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  return itemDate >= threeMonthsAgo && itemDate <= now;
})();

const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const formattedTitle = itemDate.toLocaleDateString(undefined, dateOptions);

// Prepopulate storage values in order not to fuck with provide/inject shit
walkPreSync(item.content.prose, (element) => {
  if (element.storageKey) {
    const storageKey = element.storageKey;
    if (item.content.storage[storageKey] !== undefined) {
      (element as any).storageValue = item.content.storage[storageKey];
    }
  }
});
</script>

<template>
  <div class="p-normal border-border border-b text-sm">
    <div
      class="mb-small gap-small flex items-center"
      :class="
        isNew
          ? 'font-semibold text-orange-700 dark:text-orange-300'
          : 'text-text-muted'
      "
    >
      <MyIcon v-if="isNew" name="flame" class="text-[1.2em]" />
      <NuxtTime
        :datetime="itemDate"
        v-bind="dateOptions"
        :relative="isWithinThreeMonths"
        :title="formattedTitle"
        class="cursor-help"
      />
    </div>
    <div
      :style="{
        '--linkColor': isNew
          ? 'light-dark(var(--color-orange-700),var(--color-orange-300))'
          : 'var(--color-brand)',
      }"
      class="gap-small flex flex-col text-[0.95em]"
    >
      <RenderNewsElement :element="item.content.prose" />
    </div>
  </div>
</template>
