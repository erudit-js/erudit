<script setup lang="ts">
const route = useRoute();
const articleId = Array.isArray(route.params.articleId)
  ? route.params.articleId.join('/')
  : route.params.articleId!;
const contentTypePath = stringifyContentTypePath('article', articleId);
const mainContent = await useMainContent<MainContentTopicPart>(contentTypePath);
</script>

<template>
  <MainTopicPartPage :mainContent />
</template>
