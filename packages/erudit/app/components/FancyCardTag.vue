<script lang="ts" setup>
defineProps<{ title?: string }>();
</script>

<template>
    <div
        :title
        :class="[
            `bg-bg-main text-main-xs flex items-center gap-1.5 rounded-full
            border border-(--colorBorder) px-1.5 py-0.5 text-(--colorText)`,
            title && 'cursor-help',
        ]"
    >
        <slot></slot>
    </div>
</template>
