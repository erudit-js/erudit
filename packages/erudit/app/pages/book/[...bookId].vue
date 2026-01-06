<script setup lang="ts">
const route = useRoute();
const bookId = Array.isArray(route.params.bookId)
    ? route.params.bookId.join('/')
    : route.params.bookId!;
const contentTypePath = stringifyContentTypePath('book', bookId);
const mainContent = await useMainContent<MainContentBook>(contentTypePath);
const phrase = await usePhrases('begin_learning');
</script>

<template>
    <MainGlow />
    <MainDecoration :decoration="mainContent.decoration" />
    <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
    <MainTitle icon="book" :title="mainContent.title" />
    <MainFlags :flags="mainContent.flags" />
    <MainDescription :description="mainContent.description" />
    <MainConnections :connections="mainContent.connections" />
    <MainElementCounts
        mode="single"
        :elementCounts="mainContent.elementCounts"
    />
    <div class="h-(--_pMainY)"></div>
    <MainAction
        icon="rocket"
        :label="formatText(phrase.begin_learning)"
        :link="mainContent.children[0]!.link"
    />
    <div class="h-(--_pMainY)"></div>
    <MainContentChildren :children="mainContent.children" />
    <MainSection>
        <AdsBannerBottom v-if="adsBottomAllowed()" />
    </MainSection>
</template>
