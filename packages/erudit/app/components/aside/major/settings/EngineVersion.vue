<script lang="ts" setup>
const phrase = await usePhrases('erudit');
</script>

<template>
    <AsideListItem
        icon="erudit"
        to="https://github.com/erudit-js/erudit"
        target="_blank"
        :main="phrase.erudit"
        :secondary="ERUDIT.config.version"
    />
</template>
