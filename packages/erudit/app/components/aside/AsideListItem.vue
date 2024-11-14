<script lang="ts" setup>
import type { MyIconName } from '#my-icons';

defineProps<{
    link?: string;
    icon?: MyIconName;
    main?: string;
    active?: boolean;
    secondary?: string;
}>();

const nuxtLink = defineNuxtLink({});
</script>

<template>
    <component
        :is="link ? nuxtLink : 'div'"
        :to="link"
        :class="[$style.asideListItem, active ? $style.active : '']"
    >
        <slot>
            <MyIcon v-if="icon" :name="icon" />
            <div :class="$style.main">{{ main }}</div>
            <div v-if="secondary" :class="$style.secondary">
                {{ secondary }}
            </div>
        </slot>
    </component>
</template>

<style lang="scss" module>
.asideListItem {
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: var(--gap);
    height: 60px;
    border-bottom: 1px solid var(--border);
    color: var(--textMuted);
    text-decoration: none;
    background: transparent;
    cursor: pointer;
    @include transition(color, background);

    &:hover {
        color: var(--text);
        background: var(--bgAccent);
    }

    [my-icon] {
        position: relative;
        top: 1px;
        flex-shrink: 0;
        font-size: 20px;
    }

    .secondary {
        font-weight: 500;
        color: var(--textDimmed);
    }

    [my-icon],
    .main {
        @include transition(color);
    }

    &.active {
        [my-icon],
        .main {
            color: var(--brand);
        }
    }
}
</style>
