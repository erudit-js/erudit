<script lang="ts" setup>
import eruditConfig from '#erudit/config';

import PaneContentScroll from '../../PaneContentScroll.vue';
import ItemTheme from './ItemTheme.vue';
import ItemContent from './ItemContent.vue';
import ItemGenerator from './ItemGenerator.vue';
</script>

<template>
    <PaneContentScroll>
        <ItemTheme />
        <ItemContent v-if="eruditConfig.repository" />
        <ItemGenerator />
    </PaneContentScroll>
</template>
