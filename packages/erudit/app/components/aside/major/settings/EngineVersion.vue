<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const phrase = await usePhrases('erudit');
</script>

<template>
  <AsideListItem
    icon="erudit"
    to="https://github.com/erudit-js/erudit"
    target="_blank"
    :main="phrase.erudit"
    :secondary="runtimeConfig.public.eruditVersion"
  />
</template>
