<script setup lang="ts">
import { ContentType } from '@erudit-js/cog/schema';
import { Prose } from '@erudit-js/prose/app';

const route = useRoute();
const pageId = Array.isArray(route.params.pageId)
    ? route.params.pageId.join('/')
    : route.params.pageId!;
const contentPath = createContentPath(ContentType.Page, pageId);
const mainContent = await useMainContent<MainContentPage>(contentPath);
</script>

<template>
    <h1>Page {{ pageId }}</h1>
    <div>
        {{ mainContent.breadcrumbs }}
    </div>
    <Prose
        :root="mainContent.element"
        :storage="mainContent.storage"
        :appElements
        :style="{ '--proseGap': 'var(--_pMainX)' }"
    />
</template>
