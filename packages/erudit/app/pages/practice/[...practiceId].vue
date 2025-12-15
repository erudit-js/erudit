<script setup lang="ts">
const route = useRoute();
const practiceId = Array.isArray(route.params.practiceId)
    ? route.params.practiceId.join('/')
    : route.params.practiceId!;
const contentTypePath = stringifyContentTypePath('practice', practiceId);
const mainContent = await useMainContent<MainContentTopicPart>(contentTypePath);
</script>

<template>
    <MainTopicPartPage :mainContent />
</template>
