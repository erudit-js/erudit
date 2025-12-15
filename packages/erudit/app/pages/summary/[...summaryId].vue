<script setup lang="ts">
const route = useRoute();
const summaryId = Array.isArray(route.params.summaryId)
    ? route.params.summaryId.join('/')
    : route.params.summaryId!;
const contentTypePath = stringifyContentTypePath('summary', summaryId);
const mainContent = await useMainContent<MainContentTopicPart>(contentTypePath);
</script>

<template>
    <MainTopicPartPage :mainContent />
</template>
