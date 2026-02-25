<script lang="ts" setup>
const { date } = defineProps<{ date: Date }>();

const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const isWithinThreeMonths = computed(() => {
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  return date >= threeMonthsAgo && date <= now;
});

const formattedTitle = computed(() =>
  date.toLocaleDateString(undefined, dateOptions),
);

const phrase = await usePhrases('updated');
</script>

<template>
  <div
    class="gap-small px-small text-main-sm border-border bg-bg-aside flex
      items-center rounded-xl border py-1"
  >
    <MyIcon name="update" class="text-text-dimmed -mr-0.5 text-[1.2em]" />
    <span class="text-text-muted">{{ phrase.updated }}</span>
    <NuxtTime
      :datetime="date"
      v-bind="dateOptions"
      :relative="isWithinThreeMonths"
      :title="formattedTitle"
      class="text-text-muted cursor-help font-bold"
    />
  </div>
</template>
