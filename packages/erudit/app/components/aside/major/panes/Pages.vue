<script setup lang="ts">
import PaneContentScroll from '../PaneContentScroll.vue';

const route = useRoute();

const phrase = await usePhrases('main_page', 'contributors');

const { data: contributorCount } = await useAsyncData<number>(
    'contributor-count',
    () => $fetch('/api/contributor/count'),
);
</script>

<template>
    <PaneContentScroll>
        <AsideListItem
            icon="house"
            link="/"
            :active="route.path === '/'"
            :main="phrase.main_page"
        />
        <AsideListItem
            v-if="contributorCount"
            icon="users"
            link="/contributors"
            :active="route.path.startsWith('/contributor')"
            :main="phrase.contributors"
            :secondary="contributorCount!.toString()"
        />
    </PaneContentScroll>
</template>
