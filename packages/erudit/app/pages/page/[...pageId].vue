<script setup lang="ts">
import { ContentType } from '@erudit-js/cog/schema';

const route = useRoute();
const pageId = Array.isArray(route.params.pageId)
    ? route.params.pageId.join('/')
    : route.params.pageId!;
const contentPath = createContentPath(ContentType.Page, pageId);
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
        :element="mainContent.element"
        :storage="mainContent.storage"
        :urlPath="'/' + contentPath"
        :useHash="true"
    />
</template>
