<script setup lang="ts">
import eruditConfig from '#erudit/config';
import PaneContentScroll from '../PaneContentScroll.vue';

const route = useRoute();

const phrase = await usePhrases('main_page', 'contributors', 'sponsors');

const { data: contributorCount } = await useAsyncData<number>(
    'contributor-count',
    () => $fetch('/api/contributor/count'),
);

const { data: sponsorCount } = await useAsyncData<number>('sponsor-count', () =>
    $fetch('/api/sponsor/count'),
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
        <AsideListItem
            v-if="eruditConfig.sponsors"
            icon="diamond"
            link="/sponsors/"
            :active="route.path === '/sponsors/'"
            :main="phrase.sponsors"
            :secondary="sponsorCount ? sponsorCount.toString() : ''"
        />
        <AsideListItem
            v-for="customLink in eruditConfig.customLinks"
            :link="customLink.href"
            :main="customLink.label"
            :icon="customLink.icon || 'link-external'"
        />
    </PaneContentScroll>
</template>
