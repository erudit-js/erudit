<script lang="ts" setup>
import type { MyIconName } from '#my-icons';
defineProps<{ icon: MyIconName; title: string; count?: number }>();
</script>

<template>
    <section
        class="gap-normal p-normal border-border bg-bg-aside flex items-center
            justify-center border-b transition-[border,background]"
    >
        <MyIcon :name="icon" class="text-text-muted text-[1.3em]" />
        <span class="font-semibold">{{ formatText(title) }}</span>
        <span
            v-if="count !== undefined"
            class="text-invert rounded-full bg-neutral-600 px-[8px] py-[2.5px]
                text-xs font-semibold transition-[color,background]
                dark:bg-neutral-300"
            >{{ count }}</span
        >
    </section>
</template>
