<script lang="ts" setup>
const nuxtApp = useNuxtApp();
const language = ERUDIT.config.project.language.current;
const buildTimestamp = nuxtApp.$config.public.buildTimestamp;

const formattedBuildDate = computed(() => {
    let date = new Date(buildTimestamp);
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
