<script setup lang="ts">
const route = useRoute();
const bookId = Array.isArray(route.params.bookId)
    ? route.params.bookId.join('/')
    : route.params.bookId!;
const contentTypePath = stringifyContentTypePath('book', bookId);
const mainContent = await useMainContent<MainContentBook>(contentTypePath);
const formatText = await useFormatText();
const phrase = await usePhrases('begin_learning');
</script>

<template>
    <MainGlow />
    <MainDecoration :decoration="mainContent.decoration" />
    <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
    <MainTitle icon="book" :title="mainContent.title" />
    <MainDescription :description="mainContent.description" />
    <MainAction
        icon="rocket"
        :label="formatText(phrase.begin_learning)"
        :link="mainContent.children[0]!.link"
    />
</template>
