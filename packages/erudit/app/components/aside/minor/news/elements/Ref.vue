<script lang="ts" setup>
import { onMounted } from 'vue';
import type { ProseElement } from '@jsprose/core';
import type { refSchema } from '@erudit-js/prose/elements/link/reference/core';
import type { LinkStorage } from '@erudit-js/prose/elements/link/storage';

const withBaseUrl = useBaseUrl();
const { closePreview, setPreview } = usePreview();
const { element } = defineProps<{ element: ProseElement<typeof refSchema> }>();
const linkStorage = (element as any).storageValue as LinkStorage;

const doubleClick = {
  timeout: undefined as ReturnType<typeof setTimeout> | undefined,
  startTimeout() {
    this.timeout = setTimeout(() => {
      this.reset();
    }, 400);
  },
  reset() {
    clearTimeout(this.timeout);
    this.timeout = undefined;
  },
};

function linkClick() {
  if (doubleClick.timeout && linkStorage.type !== 'error') {
    doubleClick.reset();
    closePreview();
    const openUrl =
      linkStorage.type === 'external'
        ? linkStorage.resolvedHref
        : withBaseUrl(linkStorage.resolvedHref.slice(1));
    window.open(openUrl, '_blank');
    return false;
  }

  if (linkStorage.type === 'error') {
    return false;
  }

  setPreview(linkStorage.previewRequest);
  doubleClick.startTimeout();
  return false;
}

onMounted(() => {
  if (linkStorage.type === 'error') {
    console.warn(`Error in link element inside new item: ${linkStorage.error}`);
  }
});
</script>

<template>
  <EruditLink
    @click.capture.prevent="linkClick"
    :to="linkStorage.type === 'error' ? undefined : linkStorage.resolvedHref"
    :style="{
      '--tGap': '1px',
      '--xGap': '4px',
      '--bGap': '4px',
    }"
    :class="[
      `relative -mx-[calc(var(--xGap)-3px)] -mt-(--tGap) -mb-(--bGap) rounded-sm
      bg-transparent px-(--xGap) pt-(--tGap) pb-(--bGap) underline decoration-2
      underline-offset-2 transition-[background]`,
      linkStorage.type === 'error'
        ? `hocus:bg-red-400/20 cursor-not-allowed text-red-600
          decoration-red-400/40 dark:text-red-400`
        : `hocus:bg-(--linkColor)/15 text-(--linkColor)
          decoration-[color-mix(in_srgb,var(--linkColor)30%,transparent)]`,
    ]"
  >
    {{ formatText(element.data.label) }}
  </EruditLink>
</template>
