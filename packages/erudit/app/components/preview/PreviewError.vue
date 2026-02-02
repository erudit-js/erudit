<script lang="ts" setup>
defineProps<{ message: string }>();
</script>

<template>
  <div class="h-[230px] bg-red-400">
    <strong>Error occurred!</strong>
    <div v-html="message"></div>
  </div>
</template>
