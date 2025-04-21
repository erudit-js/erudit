<script lang="ts" setup>
import eruditConfig from '#erudit/config';

const phrase = await usePhrases('_language_code', 'content');

const secondary = ref<string>();

const githubResponse = await useExternalApiRepository();
const strDate = githubResponse.commit?.commit?.author?.date;

if (strDate) {
    secondary.value = new Date(strDate).toLocaleString(phrase._language_code, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
} else console.warn(`Bad content last commit date repsonse: ${strDate}`);
</script>

<template>
    <AsideListItem
        v-if="secondary"
        :link="`https://github.com/${eruditConfig.repository?.name}`"
        target="_blank"
        icon="draw"
        :main="phrase.content"
        :secondary
    />
</template>
