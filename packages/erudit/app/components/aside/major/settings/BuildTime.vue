<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const language = ERUDIT.config.language.current;
const buildTime = runtimeConfig.public.buildTime;

const formattedBuildDate = computed(() => {
  let date = new Date(buildTime);
  return new Intl.DateTimeFormat(language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
});

const phrase = await usePhrases('built');
</script>

<template>
  <AsideListItem
    :hoverable="false"
    icon="box"
    :main="phrase.built"
    :secondary="formattedBuildDate"
  />
</template>
