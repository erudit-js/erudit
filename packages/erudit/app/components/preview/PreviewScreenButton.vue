<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';
import EruditLink from '../EruditLink';

const { external } = defineProps<{
    icon: MaybeMyIconName;
    link?: string;
    state?: 'brand' | 'disabled';
    external?: boolean;
}>();

const LinkComponent = external ? h('a') : EruditLink;
</script>

<template>
    <component
        :is="LinkComponent"
        tabindex="0"
        :to="link"
        target="_blank"
        :class="{
            [`p-small micro:text-[18px] cursor-pointer rounded bg-transparent
            text-[14px] transition-[background,color,opacity]`]: true,
            'pointer-events-none opacity-15': state === 'disabled',
            'text-brand hocus:bg-brand/20': state === 'brand',
            'text-text-muted hocus:text-text hocus:bg-bg-accent': !state,
        }"
    >
        <MaybeMyIcon :name="icon" :class="{ 'rotate-45': icon === 'plus' }" />
    </component>
</template>
