<script lang="ts" setup>
const routePath = useRoutePath();

const customLinks = ERUDIT.config.project.customLinks;

const { data: pagesData } =
    useNuxtData<AsideMajorPagesData>('aside-major-pages');

const activeState = computed(() => {
    return {
        main: routePath.value === PAGES.index,
        contributors:
            routePath.value === PAGES.contributors ||
            routePath.value.startsWith(PAGES.contributor()),
        sponsors: routePath.value === PAGES.sponsors,
    };
});

const sponsorsEnabled = !!ERUDIT.config.project.sponsors;

const phrase = await usePhrases('main_page', 'contributors', 'sponsors');
</script>

<template>
    <AsideMajorPaneTemplate>
        <ScrollHolder direction="rtl">
            <AsideListItem
                icon="house"
                :to="PAGES.index"
                :main="phrase.main_page"
                :active="activeState.main"
            />
            <AsideListItem
                icon="users"
                :to="PAGES.contributors"
                :main="phrase.contributors"
                :active="activeState.contributors"
                :secondary="pagesData?.contributorsCount"
            />
            <AsideListItem
                v-if="sponsorsEnabled"
                icon="diamond"
                :to="PAGES.sponsors"
                :main="phrase.sponsors"
                :active="activeState.sponsors"
                :secondary="pagesData?.sponsorsCount"
            />
            <AsideListItem
                v-if="customLinks"
                v-for="link in customLinks"
                :icon="link.icon"
                :main="link.label"
                :to="link.href"
                target="_blank"
            />
        </ScrollHolder>
    </AsideMajorPaneTemplate>
</template>
