<script lang="ts" setup>
import type { PreviewType } from '@erudit-js/core/preview/type';
import type { PreviewRequest } from '@erudit-js/core/preview/request';

import {
  LazyPreviewScreenContentPage,
  LazyPreviewScreenDirectLink,
  LazyPreviewScreenUnique,
} from '#components';

const previewElement = useTemplateRef('preview');
const previewScreenElement = useTemplateRef('previewScreen');
const { previewState, closePreview } = usePreview();
const route = useRoute();

const screenKey = ref(0);
const loading = ref(true);

const screenComponents: Record<PreviewType, Component> = {
  ['direct-link']: LazyPreviewScreenDirectLink,
  ['content-page']: LazyPreviewScreenContentPage,
  ['unique']: LazyPreviewScreenUnique,
};

const currentRequest = shallowRef<PreviewRequest>();
const CurrentScreen = shallowRef<Component>();

const LOADING_FALLBACK_HEIGHT = 200;
const lastHeight = ref(LOADING_FALLBACK_HEIGHT);
let resizeObserver: ResizeObserver;

watch(() => route.path, closePreview);

watch(
  () => previewState.value.request,
  (newRequest) => {
    if (newRequest === undefined) {
      // Still render last request for nice closing animation
      return;
    }

    lastHeight.value = previewElement.value?.offsetHeight || lastHeight.value;

    currentRequest.value = newRequest;
    CurrentScreen.value = screenComponents[newRequest.type];

    screenKey.value++;
    loading.value = true;

    // Lock height during loading so it does not collapse
    if (previewElement.value) {
      previewElement.value.style.height = `${Math.max(lastHeight.value, LOADING_FALLBACK_HEIGHT)}px`;
    }
  },
);

function updatePreviewHeight() {
  if (!previewElement.value) return;

  // While loading, keep previous (or fallback) height
  if (loading.value) {
    previewElement.value.style.height = `${Math.max(lastHeight.value, LOADING_FALLBACK_HEIGHT)}px`;
    return;
  }

  if (previewScreenElement.value) {
    const h = previewScreenElement.value.offsetHeight;
    previewElement.value.style.height = `${h}px`;
    if (h > 0) {
      lastHeight.value = h;
    }
  }
}

async function nextPaint() {
  await nextTick();
  await new Promise(requestAnimationFrame);
}

async function suspenseResolved() {
  await nextPaint();
  updatePreviewHeight();
  resizeObserver ||= new ResizeObserver(updatePreviewHeight);
  resizeObserver.disconnect();
  resizeObserver.observe(previewScreenElement.value!);

  await nextPaint();
  loading.value = false;

  await nextPaint();
  updatePreviewHeight();
}

// Prefetch phrases
await usePhrases(
  'book',
  'page',
  'group',
  'topic',
  'article',
  'summary',
  'practice',
  'preview_content_page_description',
);
</script>

<template>
  <div
    ref="preview"
    :class="[
      `fixed-main bg-bg-main micro:max-h-[70dvh] border-border
      pointer-events-auto bottom-0 z-5 max-h-[90dvh] touch-auto overflow-hidden
      rounded-[25px] rounded-b-none border-t
      transition-[max-height,height,translate,box-shadow,left,width]`,
      previewState.opened
        ? `translate-y-0
          shadow-[0px_-10px_15px_5px_light-dark(rgba(0,0,0,0.1),rgba(255,255,255,0.05))]`
        : 'translate-y-full shadow-transparent',
    ]"
  >
    <!-- Screen -->
    <TransitionFade>
      <div
        v-if="CurrentScreen"
        :key="screenKey"
        ref="previewScreen"
        class="absolute bottom-0 max-h-[inherit] w-full"
      >
        <Suspense @resolve="suspenseResolved">
          <CurrentScreen :request="currentRequest" />
        </Suspense>
      </div>
    </TransitionFade>

    <!-- Loading overlay -->
    <TransitionFade>
      <div
        v-if="loading"
        class="bg-bg-main absolute bottom-0 flex h-full w-full items-center
          justify-center"
      >
        <Loading class="text-text-dimmed text-[50px]" />
      </div>
    </TransitionFade>

    <!-- Blink overlay -->
    <TransitionFade>
      <div
        v-if="previewState.blink"
        :key="previewState.blink"
        class="pointer-events-none absolute top-0 left-0 h-full w-full
          touch-none"
      >
        <div
          class="bg-brand animate-opacity-blink absolute top-0 left-0 h-full
            w-full opacity-0"
        ></div>
      </div>
    </TransitionFade>
  </div>
</template>
