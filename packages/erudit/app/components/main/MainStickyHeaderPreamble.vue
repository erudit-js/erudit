<script lang="ts" setup>
const { mainContent } = defineProps<{ mainContent: MainContent }>();
</script>

<template>
  <div>
    <div class="h-main-half"></div>
    <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
    <MainFlags :flags="mainContent.flags" />
    <MainDescription
      :description="mainContent.description"
      class="text-main!"
    />
    <MainKeyLinks
      v-if="mainContent.type === 'topic' || mainContent.type === 'page'"
      mode="single"
      :elementSnippets="mainContent.snippets"
    />
    <MainConnections mode="single" :connections="mainContent.connections" />
    <MainContentStats mode="single" :stats="mainContent.stats" />
    <div class="h-main-half"></div>
  </div>
</template>
