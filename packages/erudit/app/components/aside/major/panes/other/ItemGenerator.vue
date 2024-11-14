<script lang="ts" setup>
import { version } from '@erudit/package.json';

const phrase = await usePhrases('generator');
</script>

<template>
    <AsideListItem
        link="https://github.com/Gwynerva/erudit"
        target="_blank"
        icon="chip"
        :main="phrase.generator + ':'"
        :secondary="`Erudit ${version}`"
    />
</template>
