<script setup lang="ts">
const route = useRoute();
const pageId = Array.isArray(route.params.pageId)
    ? route.params.pageId.join('/')
    : route.params.pageId!;
const contentTypePath = stringifyContentTypePath('page', pageId);
const mainContent = await useMainContent<MainContentPage>(contentTypePath);
</script>

<template>
    <MainGlow />
    <MainDecoration :decoration="mainContent.decoration" />
    <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
    <MainTitle icon="lines" :title="mainContent.title" />
    <MainDescription :description="mainContent.description" />

    <Prose
        :element="mainContent.proseElement"
        :storage="mainContent.storage"
        :urlPath="'/' + mainContent.fullId"
        :useHashUrl="true"
    />
</template>
