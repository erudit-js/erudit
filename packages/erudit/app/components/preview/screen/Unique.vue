<script lang="ts" setup>
import type { PreviewRequestUnique } from '@erudit-js/core/preview/request';

const { request } = defineProps<{ request: PreviewRequestUnique }>();

const contentTypeKey =
  request.contentType === 'topic' ? request.topicPart : request.contentType;

const previewData = await fetchJson<PreviewContentUnique>(
  `/api/preview/contentUnique/${stringifyContentTypePath(contentTypeKey, request.contentFullId)}/${request.uniqueName}` +
    '.json',
);

const elementIcon = await getElementIcon(previewData.schemaName);
const elementPhrase = await getElementPhrase(previewData.schemaName);

const main = previewData.elementTitle || elementPhrase.element_name;
const secondary = (() => {
  if (!previewData.elementTitle) {
    return previewData.contentTitle;
  }

  return `${elementPhrase.element_name} • ${previewData.contentTitle}`;
})();
</script>

<template>
  <PreviewScreen
    :icon="elementIcon"
    :main="main"
    :secondary="secondary"
    :link="previewData.link"
  >
    <div
      class="nice-scrollbars py-small relative max-h-[inherit] overflow-auto"
    >
      <Prose
        :element="previewData.prose"
        :storage="previewData.storage"
        :urlPath="'/' + previewData.link.split('#')[0]"
        :useHashUrl="false"
        :setHtmlIds="false"
      />
      <div
        v-if="previewData.fadeOverlay"
        class="to-bg-main pointer-events-none absolute bottom-0 left-0 h-full
          w-full touch-none bg-linear-to-b from-transparent"
      ></div>
    </div>
  </PreviewScreen>
</template>
