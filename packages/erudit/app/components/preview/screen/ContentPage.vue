<script lang="ts" setup>
const { request } = defineProps<{ request: PreviewRequestContentPage }>();

const previewData: PreviewContentPage = await $fetch(
    '/api/preview/contentPage/' +
        createContentPath(request.typeOrPart!, request.fullId) +
        '.json',
    {
        responseType: 'json',
    },
);

const icon = ICONS[previewData.topicPart ?? previewData.type];

const phrase = await usePhrases(
    'book',
    'group',
    'topic',
    'article',
    'summary',
    'practice',
    'page',
    'preview_content_page_description',
);

const secondary =
    phrase[previewData.topicPart ?? previewData.type] +
    (previewData.bookTitle ? ` • ${previewData.bookTitle}` : '');
</script>

<template>
    <PreviewScreen
        :icon
        :link="previewData.link"
        :main="previewData.title"
        :secondary
    >
        <div
            class="micro:text-base px-(--_pMainX) py-[calc(var(--_pMainY)*2)]
                text-sm"
        >
            {{
                previewData.description ??
                phrase.preview_content_page_description
            }}
        </div>
    </PreviewScreen>
</template>
