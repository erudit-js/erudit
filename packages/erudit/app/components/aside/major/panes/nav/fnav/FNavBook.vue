<script lang="ts" setup>
import type { FrontNavBook } from '@shared/frontNav';
import {
    insideNavBook,
    navBookId,
    navStateKey,
} from '@app/scripts/aside/major/nav';

import FNavFlags from './FNavFlags.vue';

const props = defineProps<{ navItem: FrontNavBook }>();
const navState = inject(navStateKey);
const active = computed(() => !!navState!.value[props.navItem.id]!.value);

function bookClick() {
    navBookId.value = props.navItem.id;
    insideNavBook.value = true;
}
</script>

<template>
    <TreeItem
        icon="outline/book"
        :label="navItem.label"
        :level="navItem.level"
        :link="active ? undefined : `/book/${navItem.id}`"
        @click="bookClick"
        :active
    >
        <FNavFlags v-if="navItem.flags" :flags="navItem.flags" />
    </TreeItem>
</template>
