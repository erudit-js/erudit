<script lang="ts" setup>
const { color = 'var(--color-brand)' } = defineProps<{ color?: string }>();
</script>

<template>
    <section
        :style="{ '--glowColor': color }"
        class="pointer-events-none absolute top-0 left-0 h-[300px] w-full
            touch-none overflow-hidden bg-linear-to-b from-(--glowColor)/16
            to-transparent dark:from-(--glowColor)/10"
    ></section>
</template>
