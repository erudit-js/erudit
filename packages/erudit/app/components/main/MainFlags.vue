<script lang="ts" setup>
import type { ContentFlag, ContentFlags } from '@erudit-js/core/content/flags';

const { flags } = defineProps<{ flags?: ContentFlags }>();

const flagKeys = (flags ? Object.keys(flags).sort() : []) as ContentFlag[];
</script>

<template>
  <section
    v-if="flags"
    class="gap-small micro:gap-normal micro:justify-start px-main py-main-half
      flex flex-wrap justify-center"
  >
    <MainFlag v-for="flag of flagKeys" :flag />
  </section>
</template>
