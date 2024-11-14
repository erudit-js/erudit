<script lang="ts" setup>
import { navStateKey } from '@app/scripts/aside/major/nav';
import type { FrontNavSeparator } from '@shared/frontNav';

import FNavItem from './FNavItem.vue';
import FNavFlags from './FNavFlags.vue';

const props = defineProps<{ navItem: FrontNavSeparator }>();
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
</script>

<template>
    <div>
        <NuxtLink
            :to="`/group/${navItem.id}`"
            :class="[
                $style.header,
                active && $style.active,
                accent && $style.accent,
            ]"
            :prefetch="false"
        >
            <div :class="$style.label">{{ navItem.label }}</div>
            <FNavFlags
                :class="$style.flags"
                v-if="navItem.flags"
                :flags="navItem.flags"
            />
        </NuxtLink>
        <FNavItem v-for="childItem of navItem.children" :navItem="childItem" />
    </div>
</template>

<style lang="scss" module>
.header {
    display: flex;
    gap: var(--gap);
    padding: calc(var(--gap) / 2) var(--gap);
    text-decoration: none;
    @include transition(background);

    .label {
        flex: 1;
        font-weight: 600;
        font-size: 0.95em;
        color: var(--textDimmed);
        @include transition(color);
    }

    .flags {
        flex-shrink: 0;
    }

    &:hover {
        background: var(--bgAccent);
    }
    &:hover:not(.active) .label {
        color: var(--text);
    }

    &.active .label {
        color: var(--brand);
    }
    &.accent .label {
        color: var(--textMuted);
    }
}
</style>
