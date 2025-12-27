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
    <MainDescription :description="mainContent.description" />

    <Prose
        :element="mainContent.proseElement"
        :storage="mainContent.storage"
        :urlPath="'/' + mainContent.fullId"
        :useHashUrl="true"
    />
</template>
