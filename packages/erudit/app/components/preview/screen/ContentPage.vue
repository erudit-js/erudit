<script lang="ts" setup>
const { request } = defineProps<{ request: PreviewRequestContentPage }>();

const previewData: PreviewContentPage = await $fetch(
    '/api/preview/contentPage/' + request.shortId + '...' + request.typeOrPart,
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
        <div class="p-normal micro:text-base text-sm">
            {{
                previewData.description ??
                phrase.preview_content_page_description
            }}
        </div>
    </PreviewScreen>
</template>
