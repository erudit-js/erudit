<script lang="ts" setup>
const { mainContent } = defineProps<{ mainContent: MainContent }>();

const hasPreamble = computed(() => {
  const hasBreadcrumbs = mainContent.breadcrumbs.length > 0;
  const hasDescription = !!mainContent.description;
  const hasFlags = !!mainContent.flags;
  const hasConnections = !!mainContent.connections;

  let hasKeyElements = false;
  if (mainContent.type === 'topic' || mainContent.type === 'page') {
    hasKeyElements =
      mainContent.snippets?.some((snippet) => !!snippet.key) ?? false;
  }

  return (
    hasBreadcrumbs ||
    hasDescription ||
    hasFlags ||
    hasConnections ||
    hasKeyElements
  );
});

/** Do not render preamble content until requested. */
const preambleFirstCalled = ref(false);
const preambleOpened = ref(false);

const scrollUp = useScrollUp();
const hiderVisible = ref(true);
const visible = computed(() => {
  return scrollUp.value && !hiderVisible.value;
});

const route = useRoute();
watch(
  () => [route.path, route.hash],
  () => {
    preambleOpened.value = false;
  },
);

const { previewState, closePreview } = usePreview();
watch(
  () => previewState.value.opened,
  (opened) => {
    if (opened) {
      preambleOpened.value = false;
    }
  },
);

function toggleClick() {
  preambleFirstCalled.value = true;
  preambleOpened.value = !preambleOpened.value;
  closePreview();
}

const hiderElement = useTemplateRef('hider');
const expanderElement = useTemplateRef('expander');
const expanderContentElement = useTemplateRef('expanderContent');

onMounted(() => {
  //
  // Expander auto-height
  //

  function updateExpanderHeight() {
    if (!expanderElement.value || !expanderContentElement.value) {
      return;
    }

    if (preambleOpened.value) {
      expanderElement.value.style.height = `${expanderContentElement.value.offsetHeight}px`;
    } else {
      expanderElement.value.style.height = '0px';
    }
  }

  const expanderObserver = new ResizeObserver(updateExpanderHeight);

  watchEffect(() => {
    expanderObserver.disconnect();
    if (!expanderElement.value || !expanderContentElement.value) {
      return;
    }
    expanderObserver.observe(expanderContentElement.value);
  });

  watch(preambleOpened, updateExpanderHeight);

  //
  // Header Visibility
  //

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    hiderVisible.value = entry?.isIntersecting ?? false;
  });

  watchEffect(() => {
    intersectionObserver.disconnect();
    if (!hiderElement.value) {
      return;
    }
    intersectionObserver.observe(hiderElement.value);
  });
});
</script>

<template>
  <div>
    <div
      ref="hider"
      class="pointer-events-none absolute top-0 left-0 h-full w-full touch-none"
    ></div>
    <Teleport to="#teleports">
      <div
        :class="[
          `fixed-main bg-bg-aside from-brand/8 dark:from-brand/10 to-bg-aside
          micro:text-main border-brand/10 top-0 z-5 rounded-b-[25px] border
          border-t-0 bg-linear-to-t text-[.8em]
          transition-[translate,width,left]`,
          visible ? 'translate-y-0' : '-translate-y-full',
        ]"
      >
        <!-- Expander part -->
        <div
          v-if="hasPreamble"
          ref="expander"
          :style="{ height: '0px' }"
          class="overflow-hidden transition-[height]"
        >
          <div ref="expanderContent">
            <div
              v-if="preambleFirstCalled"
              class="text-main nice-scrollbars max-h-[70dvh] overflow-auto"
            >
              <Suspense>
                <MainStickyHeaderPreamble :mainContent />
              </Suspense>
            </div>
          </div>
        </div>
        <!-- Toggler -->
        <div
          :class="[
            `text-main relative overflow-clip rounded-b-[25px]
            transition-[box-shadow]`,
            visible
              ? 'shadow-[0px_5px_15px_0px_light-dark(rgba(0,0,0,0.1),rgba(255,255,255,0.05))]'
              : 'shadow-transparent',
          ]"
        >
          <div class="absolute top-0 left-0 h-full w-full"></div>
          <div
            class="from-brand/10 dark:from-brand/5 absolute top-0 left-0 h-full
              w-full bg-linear-to-t to-transparent"
          ></div>
          <div
            @click="toggleClick"
            :class="[
              `py-normal gap-small micro:gap-normal group px-small
              micro:px-normal border-brand/20 dark:border-brand/10 relative flex
              items-center justify-center border-t bg-transparent
              transition-[background]`,
              hasPreamble && 'hocus:bg-brand/8 cursor-pointer',
            ]"
          >
            <MyIcon
              :name="ICONS[mainContent.type]"
              class="shrink-0 text-[1.2em]
                text-[color-mix(in_srgb,var(--color-brand),var(--color-text)_70%)]"
            />
            <FancyBold
              :text="mainContent.title"
              class="text-center text-[1.1em]"
            />
            <MyIcon
              v-if="hasPreamble"
              :name="preambleOpened ? 'plus' : 'bookmark-star'"
              :class="[
                `group-hocus:opacity-100 shrink-0 text-[1.2em]
                text-[color-mix(in_srgb,var(--color-brand),var(--color-text)_50%)]
                opacity-40 transition-opacity`,
                preambleOpened && 'rotate-45',
              ]"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
