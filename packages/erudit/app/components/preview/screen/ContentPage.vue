<script lang="ts" setup>
import type { PreviewRequestContentPage } from '@erudit-js/core/preview/request';

const { request } = defineProps<{ request: PreviewRequestContentPage }>();

const contentTypeKey =
  request.contentType === 'topic' ? request.topicPart : request.contentType;

const previewData: PreviewContentPage = await fetchJson(
  '/api/preview/contentPage/' +
    stringifyContentTypePath(contentTypeKey, request.fullId) +
    '.json',
);

const icon = ICONS[contentTypeKey];

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
  phrase[contentTypeKey] +
  (previewData.bookTitle ? ` • ${previewData.bookTitle}` : '');
</script>

<template>
  <PreviewScreen
    :icon
    :link="previewData.link"
    :main="previewData.title"
    :secondary
  >
    <div class="micro:text-base px-main py-main text-sm">
      {{ previewData.description ?? phrase.preview_content_page_description }}
    </div>
  </PreviewScreen>
</template>
