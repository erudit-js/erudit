<script lang="ts" setup>
import { navStateKey } from '@app/scripts/aside/major/nav';
import type { FrontNavTopic } from '@shared/frontNav';

import FNavFlags from './FNavFlags.vue';

const props = defineProps<{ navItem: FrontNavTopic }>();
const navState = inject(navStateKey);
const active = computed(
    () => navState!.value[props.navItem.id]!.value === 'active',
);
</script>

<template>
    <TreeItem
        icon="outline/file-lines"
        :active
        :label="navItem.label"
        :level="navItem.level"
        :link="`/${navItem.part}/${navItem.id}`"
    >
        <FNavFlags v-if="navItem.flags" :flags="navItem.flags" />
    </TreeItem>
</template>
