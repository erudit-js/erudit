<script lang="ts" setup>
defineProps<{ decoration?: string }>();
</script>

<template>
  <section
    v-if="decoration"
    class="pl-small pb-small pt-main pr-main float-right max-[700px]:hidden"
  >
    <img
      :src="fileUrl(decoration!)"
      class="block aspect-square max-h-[125px] w-full max-w-[125px]"
    />
  </section>
</template>
