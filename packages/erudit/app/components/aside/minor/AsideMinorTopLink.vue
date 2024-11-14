<script lang="ts" setup>
import type { MyIconName } from '#my-icons';

defineProps<{ link?: string; icon: MyIconName; active?: boolean }>();

const Link = defineNuxtLink({ prefetch: false });
</script>

<template>
    <Link
        :to="link"
        :class="[
            $style.asideMinorTopLink,
            !link && $style.noLink,
            active && $style.active,
        ]"
    >
        <MyIcon :name="icon" />
    </Link>
</template>

<style lang="scss" module>
.asideMinorTopLink {
    position: relative;
    font-size: 22px;
    padding: 20px 12px;
    color: var(--textDimmed);
    cursor: pointer;
    color: var(--textMuted);

    @include transition(color, opacity);

    &:hover {
        color: var(--text);
        &::after {
            background: var(--border);
        }
    }

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 100%;
        height: 3px;
        background: transparent;
        @include transition(background);
    }

    &.active {
        color: var(--text);
        &::after {
            background: var(--textMuted);
        }
    }

    &.noLink {
        opacity: 0.8;
        cursor: default;
        color: var(--textDisabled);
        &::after {
            background: transparent;
        }
    }
}
</style>
