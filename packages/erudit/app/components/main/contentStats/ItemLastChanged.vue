<script lang="ts" setup>
type LastChangedSource = NonNullable<
  ReturnType<typeof useLastChangedSource>['value']
>;

const { source } = defineProps<{ source: LastChangedSource }>();

const date = ref<Date | null>(null);

const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const isWithinThreeMonths = computed(() => {
  if (!date.value) return false;
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  return date.value >= threeMonthsAgo && date.value <= now;
});

const formattedTitle = computed(() =>
  date.value ? date.value.toLocaleDateString(undefined, dateOptions) : '',
);

const phrase = await usePhrases('updated');

onMounted(async () => {
  if (source.type === 'date') {
    date.value = new Date(source.value);
    return;
  }

  if (source.type === 'github') {
    try {
      const data = await $fetch<any[]>(source.url, {
        query: { path: source.path, per_page: 1 },
        responseType: 'json',
      });
      if (Array.isArray(data) && data[0]?.commit?.committer?.date) {
        date.value = new Date(data[0].commit.committer.date);
      }
    } catch {
      // silently ignore API errors
    }
  }
});
</script>

<template>
  <div
    v-if="date"
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
