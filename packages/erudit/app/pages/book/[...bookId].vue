<script setup lang="ts">
const route = useRoute();
const bookId = Array.isArray(route.params.bookId)
    ? route.params.bookId.join('/')
    : route.params.bookId!;
const contentTypePath = stringifyContentTypePath('book', bookId);
const mainContent = await useMainContent<MainContentBook>(contentTypePath);

const { showNewsAside, showContentContributionsAside } = useAsideMinor();
if (ERUDIT.config.contributors?.enabled) {
    showContentContributionsAside(
        mainContent.contentRelativePath,
        mainContent.type,
        undefined,
        mainContent.contributions,
    );
} else {
    showNewsAside();
}

const phrase = await usePhrases('begin_learning');

await useContentSeo({
    title: mainContent.title,
    description: mainContent.description,
    contentTypePath: {
        type: 'book',
        contentId: mainContent.shortId,
    },
    seo: mainContent.seo,
});
</script>

<template>
    <MainGlow />
    <MainDecoration :decoration="mainContent.decoration" />
    <MainSectionPreamble>
        <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
        <MainTitle icon="book" :title="mainContent.title" />
        <MainFlags :flags="mainContent.flags" />
        <MainDescription :description="mainContent.description" />
        <MainConnections :connections="mainContent.connections" />
        <MainContentStats mode="single" :stats="mainContent.stats" />
        <div class="h-main-half"></div>
        <MainAction
            icon="rocket"
            :label="formatText(phrase.begin_learning)"
            :link="mainContent.children[0]!.link"
        />
        <div class="h-main-half"></div>
    </MainSectionPreamble>
    <MainContentChildren :children="mainContent.children" />
    <MainSection>
        <AdsBannerBottom v-if="adsBottomAllowed()" />
    </MainSection>
</template>
