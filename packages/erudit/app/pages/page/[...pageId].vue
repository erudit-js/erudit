<script setup lang="ts">
const route = useRoute();
const pageId = Array.isArray(route.params.pageId)
    ? route.params.pageId.join('/')
    : route.params.pageId!;
const contentTypePath = stringifyContentTypePath('page', pageId);
const mainContent = await useMainContent<MainContentPage>(contentTypePath);
</script>

<template>
    <MainSection>
        <MainGlow />
        <MainDecoration :decoration="mainContent.decoration" />
        <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
        <MainTitle icon="lines" :title="mainContent.title" />
        <MainFlags :flags="mainContent.flags" />
        <MainDescription :description="mainContent.description" />
        <MainQuickLinks mode="single" :quickLinks="mainContent.quickLinks" />
        <MainConnections :connections="mainContent.connections" />
        <MainContentStats mode="single" :stats="mainContent.stats" />
        <div class="h-(--_pMainY)"></div>
        <MainQuoteLoader />
        <div class="h-(--_pMainY)"></div>
    </MainSection>
    <MainSection>
        <Prose
            :element="mainContent.proseElement"
            :storage="mainContent.storage"
            :urlPath="'/' + mainContent.fullId"
            :useHashUrl="true"
        />
    </MainSection>
    <MainSection>
        <AdsBannerBottom v-if="adsBottomAllowed()" />
    </MainSection>
</template>
