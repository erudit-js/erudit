<script lang="ts" setup>
defineProps<{ text: string }>();
</script>

<template>
  <p class="text-text-dimmed px-normal py-big text-center font-semibold">
    {{ formatText(text) }}
  </p>
</template>
