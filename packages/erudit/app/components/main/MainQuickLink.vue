<script lang="ts" setup>
import { autoUpdate, shift } from '@floating-ui/vue';

const { quickLink } = defineProps<{ quickLink: ElementSnippet }>();

const containerElement = useTemplateRef('container');
const toggleElement = useTemplateRef('toggle');
const popupElement = useTemplateRef('popup');
const { popupVisible, popupStyles } = usePopup(
  containerElement,
  toggleElement,
  popupElement,
  {
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
      shift({
        boundary: document?.querySelector('[data-erudit-main]') || undefined,
      }),
    ],
  },
);

const elementIcon = await getElementIcon(quickLink.schemaName);

const title = computed(() => {
  if (quickLink.quick?.title) {
    return quickLink.quick.title;
  } else {
    return quickLink.title;
  }
});

const description = computed(() => {
  if (quickLink.quick?.description) {
    return quickLink.quick.description;
  } else {
    return quickLink.description;
  }
});
</script>

<template>
  <div ref="container">
    <div ref="toggle">
      <EruditLink
        :to="quickLink.link"
        class="gap-small border-border px-small text-text-muted text-main-sm
          hocus:text-brand hocus:border-brand hocus:ring-brand/25 flex
          items-center rounded border bg-(--quickBg) py-1 ring-2
          ring-transparent transition-[color,border,box-shadow]"
      >
        <MaybeMyIcon :name="elementIcon" class="-mr-0.5 text-[1.2em]" />
        <span>{{ formatText(title) }}</span>
      </EruditLink>
    </div>
    <TransitionFade>
      <div
        v-if="description && popupVisible"
        :style="popupStyles"
        ref="popup"
        class="z-10 max-w-[300px] p-2"
      >
        <div
          class="px-small text-main-xs rounded bg-neutral-900 py-1 text-white
            shadow-lg/30 dark:bg-neutral-400 dark:text-black
            dark:shadow-neutral-500"
        >
          {{ formatText(description) }}
        </div>
      </div>
    </TransitionFade>
  </div>
</template>
