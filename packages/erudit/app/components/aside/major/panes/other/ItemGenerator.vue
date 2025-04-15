<script lang="ts" setup>
import { version } from '@erudit/package.json';
</script>

<template>
    <AsideListItem
        link="https://github.com/erudit-js/erudit"
        target="_blank"
        icon="chip"
        main="Erudit"
        :secondary="version"
    />
</template>
