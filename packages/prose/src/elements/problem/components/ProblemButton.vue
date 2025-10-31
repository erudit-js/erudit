<script lang="ts" setup>
defineProps<{ active?: boolean }>();
</script>

<template>
    <button
        :class="[
            `bg-bg-main border-border/80 text-main-xs min-w-[50px]
            cursor-pointer rounded border px-[10px] py-[5px] font-semibold
            shadow shadow-[light-dark(#d9d9d9,#3c3c3c)]
            transition-[color,background,border,box-shadow]`,
            {
                'border-brand/50 bg-brand/10 text-brand': active,
                ['text-text-muted hocus:text-brand hocus:border-brand/50']:
                    !active,
            },
        ]"
    >
        <slot></slot>
    </button>
</template>
