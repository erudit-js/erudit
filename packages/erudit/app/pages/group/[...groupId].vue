<script setup lang="ts">
const route = useRoute();
const groupId = Array.isArray(route.params.groupId)
    ? route.params.groupId.join('/')
    : route.params.groupId!;
const contentTypePath = stringifyContentTypePath('group', groupId);
const mainContent = await useMainContent<MainContentGroup>(contentTypePath);
const formatText = await useFormatText();
const phrase = await usePhrases('begin_learning');
</script>

<template>
    <MainGlow />
    <MainDecoration :decoration="mainContent.decoration" />
    <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
    <MainTitle icon="folder-open" :title="mainContent.title" />
    <MainFlags :flags="mainContent.flags" />
    <MainDescription :description="mainContent.description" />
    <MainConnections :connections="mainContent.connections" />
    <MainElementCounts :elementCounts="mainContent.elementCounts" />
    <MainAction
        icon="rocket"
        :label="formatText(phrase.begin_learning)"
        :link="mainContent.children[0]!.link"
    />
</template>
