<script lang="ts" setup>
const { elementCounts } = defineProps<{
    elementCounts?: Record<string, number>;
}>();

const counts = ERUDIT.config.project.countElements.reduce<
    Record<string, number>
>((acc, current) => {
    if (Array.isArray(current)) {
        const firstKey = current[0]!;
        const sum = current.reduce((sum, name) => {
            return sum + (elementCounts?.[name] || 0);
        }, 0);
        if (sum > 0) {
            acc[firstKey] = sum;
        }
    } else {
        const count = elementCounts?.[current] || 0;
        if (count > 0) {
            acc[current] = count;
        }
    }
    return acc;
}, {});

const phrase = await usePhrases('element_stats');
</script>

<template>
    <section
        v-if="elementCounts"
        class="px-(--_pMainX) py-[calc(var(--_pMainY)/2)]"
    >
        <MainSubTitle :title="phrase.element_stats + ':'" />
        <div
            class="micro:justify-start gap-normal flex flex-wrap justify-center"
        >
            <MainElementCount
                v-for="(count, schemaName) of counts"
                :schemaName
                :count
            />
        </div>
    </section>
</template>
