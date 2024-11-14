<script lang="ts" setup>
import type { FrontNavFolder } from '@shared/frontNav';
import { navStateKey } from '@app/scripts/aside/major/nav';

import FNavItem from './FNavItem.vue';
import FNavFlags from './FNavFlags.vue';

const props = defineProps<{ navItem: FrontNavFolder }>();
const navState = inject(navStateKey);

const active = ref(false);
const accent = ref(false);

function onStateUpdate() {
    const newState = navState!.value[props.navItem.id]!.value;
    active.value = newState === 'active';
    accent.value = newState === 'activePart';
}

onStateUpdate();
watch(navState!.value[props.navItem.id]!, onStateUpdate);

const visible = computed(() => active.value || accent.value);
</script>

<template>
    <div>
        <TreeItem
            :icon="`folder${visible ? '-open' : ''}`"
            :link="`/group/${navItem.id}`"
            :label="navItem.label"
            :active
            :accent
            :level="navItem.level"
        >
            <FNavFlags v-if="navItem.flags" :flags="navItem.flags" />
        </TreeItem>

        <div :class="[$style.groupBody, visible && $style.visible]">
            <FNavItem
                v-for="childItem of navItem.children"
                :navItem="childItem"
            />
        </div>
    </div>
</template>

<style lang="scss" module>
@use '$/partials/fnav';

.groupBody {
    overflow: hidden;
    height: 0;
    @include transition(height);

    &.visible {
        height: auto;
    }
}
</style>
