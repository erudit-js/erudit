<script setup lang="ts">
const route = useRoute();
const groupId = Array.isArray(route.params.groupId)
    ? route.params.groupId.join('/')
    : route.params.groupId!;
const contentTypePath = stringifyContentTypePath('group', groupId);
const mainContent = await useMainContent<MainContentGroup>(contentTypePath);
const phrase = await usePhrases('begin_learning');
</script>

<template>
    <MainGlow />
    <MainDecoration :decoration="mainContent.decoration" />
    <MainSectionPreamble>
        <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
        <MainTitle icon="folder-open" :title="mainContent.title" />
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
