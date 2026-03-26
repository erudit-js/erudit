<script lang="ts" setup>
defineProps<{ title: string }>();
</script>

<template>
  <h2
    class="text-main-sm micro:text-left pb-main-half m-0 text-center
      font-semibold"
  >
    {{ formatText(title) }}
  </h2>
</template>
