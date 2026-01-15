<script lang="ts" setup>
import type { ResolvedTocItem } from '@erudit-js/prose';
import { headingSchema } from '@erudit-js/prose/elements/heading/core';

const { item, level } = defineProps<{ item: ResolvedTocItem; level: number }>();

const elementIcon = await (async () => {
    let schemaName =
        item.type === 'heading' ? headingSchema.name : item.schemaName;

    return await getElementIcon(schemaName);
})();

const active = ref(false);

// Inject active heading IDs from parent
const activeHeadingIds = inject<Ref<Set<string>>>(
    'activeHeadingIds',
    ref(new Set()),
);

onMounted(() => {
    if (item.type === 'heading') {
        // For headings, use the provided active IDs
        watch(
            activeHeadingIds,
            (ids) => {
                active.value = ids.has(item.elementId);
            },
            { immediate: true },
        );
    } else if (item.elementId) {
        // For non-heading elements, use IntersectionObserver
        const targetElement = document.getElementById(item.elementId);

        if (targetElement) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    active.value = entry.isIntersecting;
                });
            });

            observer.observe(targetElement);

            onUnmounted(() => {
                observer.disconnect();
            });
        }
    }
});
</script>

<template>
    <TreeItem
        :level
        :icon="elementIcon"
        :main="formatText(item.title)"
        :state="active ? 'active' : undefined"
        :to="'#' + item.elementId"
    />
    <div v-if="item.type === 'heading'" class="relative overflow-hidden">
        <div
            :style="{ '--level': level ? +level : 0 }"
            :class="[
                `absolute top-0
                left-[calc(var(--spacing-normal)*(var(--level)+1)+8px)] h-full
                border-l opacity-40 transition-[border]`,
                [active ? 'border-brand' : 'border-text-dimmed'],
            ]"
        ></div>
        <TocItem
            v-for="child of item.children"
            :item="child"
            :level="item.level"
        />
    </div>
</template>
