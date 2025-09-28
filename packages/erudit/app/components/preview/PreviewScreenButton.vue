<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

defineProps<{
    icon: MaybeMyIconName;
    link?: string;
    state?: 'brand' | 'disabled';
}>();
</script>

<template>
    <a
        tabindex="0"
        :href="link"
        target="_blank"
        :class="{
            'p-small micro:text-[18px] cursor-pointer rounded bg-transparent text-[14px] transition-[background,color,opacity]': true,
            'pointer-events-none opacity-15': state === 'disabled',
            'text-brand hocus:bg-brand/20': state === 'brand',
            'text-text-muted hocus:text-text hocus:bg-bg-accent': !state,
        }"
    >
        <MaybeMyIcon :name="icon" />
    </a>
</template>
