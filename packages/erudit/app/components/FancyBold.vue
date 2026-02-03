<script lang="ts" setup>
const { color = 'var(--color-brand)' } = defineProps<{
  text: string;
  color?: string;
}>();
</script>

<template>
  <span
    :style="{ '--titleColor': color }"
    class="text-text-deep leading-tight font-extrabold
      text-shadow-[2px_2px_color-mix(in_srgb,var(--titleColor),transparent_65%)]"
  >
    {{ formatText(text) }}
  </span>
</template>
