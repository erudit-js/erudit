<script lang="ts" setup>
import type { MyIconName } from '#my-icons';

defineProps<{
    label: string;
    icon?: MyIconName;
    svg?: string;
    level?: number;
    link?: string;
    active?: boolean;
    accent?: boolean;
}>();
</script>

<template>
    <NuxtLink
        :prefetch="false"
        :to="link"
        :class="[
            $style.treeItem,
            active && $style.active,
            accent && $style.accent,
        ]"
        :style="{ ['--_level']: level ?? 0 }"
    >
        <MyIcon v-if="icon" :class="$style.icon" :name="icon" />
        <MyRuntimeIcon v-else :class="$style.icon" name="tree-item-icon" :svg />
        <div :class="$style.main">{{ label }}</div>
        <div v-if="$slots.default" :class="$style.after">
            <slot></slot>
        </div>
    </NuxtLink>
</template>

<style lang="scss" module>
.treeItem {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: calc(var(--gap) / 1.6);
    padding: calc(var(--gap) / 2) var(--gap);
    padding-left: calc((var(--_level) + 1) * var(--gap));
    font-size: 0.95em;
    color: var(--textMuted);
    text-decoration: none;
    cursor: pointer;

    @include transition(background);

    &:hover {
        background: var(--bgAccent);
        .icon,
        .main {
            color: var(--text);
        }
    }

    &.active {
        .icon,
        .main {
            color: var(--brand);
        }
    }
    &.accent {
        .icon,
        .main {
            color: var(--text);
        }
    }

    .icon,
    .main {
        @include transition(color);
    }

    .main {
        flex: 1;
    }

    .icon,
    .after {
        flex-shrink: 0;
    }

    .icon {
        font-size: 16px;
    }
}
</style>
