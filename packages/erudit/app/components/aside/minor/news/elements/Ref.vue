<script lang="ts" setup>
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
  if (doubleClick.timeout) {
    doubleClick.reset();
    closePreview();
    const openUrl =
      linkStorage.type === 'direct'
        ? linkStorage.resolvedHref
        : withBaseUrl(linkStorage.resolvedHref.slice(1));
    window.open(openUrl, '_blank');
    return false;
  }

  setPreview(linkStorage.previewRequest);
  doubleClick.startTimeout();
  return false;
}
</script>

<template>
  <EruditLink
    @click.capture.prevent="linkClick"
    :to="linkStorage.resolvedHref"
    :style="{
      '--tGap': '1px',
      '--xGap': '4px',
      '--bGap': '4px',
    }"
    class="hocus:bg-(--linkColor)/15 relative -mx-[calc(var(--xGap)-3px)]
      -mt-(--tGap) -mb-(--bGap) rounded-sm bg-transparent px-(--xGap)
      pt-(--tGap) pb-(--bGap) text-(--linkColor) underline
      decoration-[color-mix(in_srgb,var(--linkColor)30%,transparent)]
      decoration-2 underline-offset-2 transition-[background]"
  >
    {{ formatText(element.data.label) }}
  </EruditLink>
</template>
