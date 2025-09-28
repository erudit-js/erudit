<script lang="ts" setup>
import { ContentType } from '@erudit-js/cog/schema';

import ItemTemplate from './ItemTemplate.vue';
import ContentNavItem from './ContentNavItem.vue';

const { navItem } = defineProps<{
    navItem: FrontContentNavGroup;
    level?: number;
}>();

const { shortContentId } = inject(asideMajorContentNavSymbol)!;

const hasActiveDescendant = computed(() => {
    return checkActiveDescendant(navItem.children, shortContentId.value);
});

const hasActiveDirectChild = computed(() => {
    return checkActiveDirectChild(navItem.children, shortContentId.value);
});

const state = computed(() => {
    if (shortContentId.value === navItem.shortId) {
        return 'active';
    }

    if (hasActiveDescendant.value) {
        return 'accent';
    }

    return undefined;
});

function checkActiveDescendant(
    children: FrontContentNavItem[],
    targetShortId: string | undefined,
): boolean {
    if (!children) {
        return false;
    }

    for (const child of children) {
        if (child.shortId === targetShortId) {
            return true;
        }

        if (child.type === ContentType.Group) {
            if (checkActiveDescendant(child.children, targetShortId)) {
                return true;
            }
        }
    }

    return false;
}

function checkActiveDirectChild(
    children: FrontContentNavItem[],
    targetShortId: string | undefined,
): boolean {
    if (!children) return false;
    return children.some((child) => child.shortId === targetShortId);
}
</script>

<template>
    <ItemTemplate
        :navItem
        :icon="state ? 'folder-open' : 'folder'"
        :state
        :level
    />
    <div
        :class="[
            'relative overflow-hidden transition-[height]',
            state ? 'h-auto' : 'h-0',
        ]"
    >
        <div
            :style="{ '--level': level ? +level : 0 }"
            :class="[
                'absolute top-0 left-[calc(var(--spacing-normal)*(var(--level)+1)+2px)] h-full border-l opacity-40 transition-[border]',
                [hasActiveDirectChild ? 'border-brand' : 'border-text-dimmed'],
            ]"
        ></div>
        <ContentNavItem
            v-for="child of navItem.children"
            :navItem="child"
            :level="level ? level + 1 : 1"
        />
    </div>
</template>
