<script lang="ts" setup>
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
</script>

<template>
    <div class="p-normal border-border border-b text-sm transition-[border]">
        <div
            class="mb-small gap-small flex items-center transition-[color]"
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
        <div>Content</div>
    </div>
</template>
