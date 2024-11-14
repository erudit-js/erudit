<script lang="ts" setup>
import type { FrontNavItem, FrontNavType } from '@shared/frontNav';

import FNavBook from './FNavBook.vue';
import FNavSeparator from './FNavSeparator.vue';
import FNavFolder from './FNavFolder.vue';
import FNavTopic from './FNavTopic.vue';

defineProps<{ navItem: FrontNavItem }>();

const navComponent: Record<FrontNavType, Component> = {
    book: FNavBook,
    separator: FNavSeparator,
    folder: FNavFolder,
    topic: FNavTopic,
};
</script>

<template>
    <component
        :is="navComponent[navItem.type]"
        :navItem
        :class="[
            $style.frontNavItem,
            $style[
                `frontNav${navItem.type[0]!.toUpperCase() + navItem.type.substring(1)}`
            ],
        ]"
    />
</template>

<style lang="scss" module>
@use '$/partials/fnav';
</style>
