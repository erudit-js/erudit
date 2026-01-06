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
        v-bind="{
            [external ? 'href' : 'to']: link,
        }"
        tabindex="0"
        target="_blank"
        :class="{
            [`micro:size-[32px] size-[28px] cursor-pointer rounded
            bg-transparent transition-[background,color,opacity]`]: true,
            'pointer-events-none opacity-15': state === 'disabled',
            'text-brand hocus:bg-brand/20': state === 'brand',
            'text-text-muted hocus:text-text hocus:bg-bg-accent': !state,
        }"
    >
        <MaybeMyIcon
            :name="icon"
            :class="{
                'size-full': true,
                'scale-120 rotate-45': icon === 'plus',
            }"
        />
    </component>
</template>
