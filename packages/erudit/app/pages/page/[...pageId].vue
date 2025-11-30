<script setup lang="ts">
const route = useRoute();
const pageId = Array.isArray(route.params.pageId)
    ? route.params.pageId.join('/')
    : route.params.pageId!;
const contentPath = createContentPath('page', pageId);
const mainContent = await useMainContent<MainContentPage>(contentPath);
</script>

<template>
    <h1>Page {{ pageId }}</h1>
    <EruditLink to="/page/sub-group/sub-page/#paragraph-i6rgnx2vw8D3">
        Go to Anchor
    </EruditLink>
    <div>
        {{ mainContent.breadcrumbs }}
    </div>
    <Prose
        :element="mainContent.proseElement"
        :storage="mainContent.storage"
        :urlPath="'/' + contentPath"
        :useHash="true"
    />
</template>
