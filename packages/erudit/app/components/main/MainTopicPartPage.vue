<script lang="ts" setup>
defineProps<{
    mainContent: MainContentTopicPart;
}>();
</script>

<template>
    <MainGlow />
    <MainDecoration :decoration="mainContent.decoration" />
    <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
    <MainTitle :icon="ICONS[mainContent.part]" :title="mainContent.title" />
    <MainFlags :flags="mainContent.flags" />
    <MainDescription :description="mainContent.description" />
    <MainQuickLinks mode="single" :quickLinks="mainContent.quickLinks" />
    <MainConnections :connections="mainContent.connections" />
    <MainElementCounts :elementCounts="mainContent.elementCounts" />

    <Prose
        :element="mainContent.proseElement"
        :storage="mainContent.storage"
        :urlPath="'/' + mainContent.fullId"
        :useHashUrl="true"
    />
</template>
