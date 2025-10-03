<script lang="ts" setup>
import { ContentType } from '@erudit-js/cog/schema';

import ItemTemplate from './ItemTemplate.vue';
import ContentNavItem from './ContentNavItem.vue';

const { navItem } = defineProps<{ navItem: FrontContentNavGroup }>();

const { shortContentId } = inject(asideMajorContentNavSymbol)!;

const hasActiveDescendant = computed(() => {
    return checkActiveDescendant(navItem.children, shortContentId.value);
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
</script>

<template>
    <div
        class="my-small py-small mx-0 border-y border-[var(--color-border)] px-0
            first:mt-0 first:border-t-0 first:pt-0 [&+div]:mt-0
            [&+div]:border-t-0 [&+div]:pt-0"
    >
        <ItemTemplate :navItem :state :class="['font-semibold']" />
        <ContentNavItem
            v-for="(child, i) in navItem.children"
            :key="child.shortId"
            :navItem="child"
        />
    </div>
</template>
