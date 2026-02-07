<script lang="ts" setup>
import PaneGlobalNav from './contentNav/PaneGlobalNav.vue';
import PaneBookNav from './contentNav/PaneBookNav.vue';
import PaneLanguages from './languages/PaneLanguages.vue';
import PanePages from './pages/PanePages.vue';
import PaneSearch from './search/PaneSearch.vue';
import PaneSettings from './settings/PaneSettings.vue';

const paneMap: Record<AsideMajorPane, Component> = {
  [AsideMajorPane.GlobalNav]: PaneGlobalNav,
  [AsideMajorPane.BookNav]: PaneBookNav,
  [AsideMajorPane.Languages]: PaneLanguages,
  [AsideMajorPane.Pages]: PanePages,
  [AsideMajorPane.Search]: PaneSearch,
  [AsideMajorPane.Settings]: PaneSettings,
};

const route = useRoute();
const asideMajorPane = useAsideMajorPane();
const asideState = useAsideState();
const direction = ref<'forward' | 'backward'>('forward');
const activePaneComponent = computed(() => paneMap[asideMajorPane.value]);

watch(asideMajorPane, (next, prev) => {
  const nextIdx = asideMajorPanes.indexOf(next);
  const prevIdx = asideMajorPanes.indexOf(prev);

  if (nextIdx === -1 || prevIdx === -1) {
    direction.value = 'forward';
    return;
  }

  direction.value = nextIdx > prevIdx ? 'forward' : 'backward';
});

onMounted(() => {
  if (route.query.q) {
    asideMajorPane.value = AsideMajorPane.Search;
    const styles = getComputedStyle(document.documentElement);
    const aside1Bp = styles.getPropertyValue('--breakpoint-aside1');
    if (window.matchMedia(`(max-width: ${aside1Bp})`).matches) {
      asideState.value.opened = AsideType.Major;
    }
  }
});

// Prefetch pages data
await useFetch('/api/aside/major/pages', {
  key: asideMajorPagesKey,
  deep: false,
  responseType: 'json',
});

// Prefetch phrases
await usePhrases(
  'theme',
  'theme_light',
  'theme_dark',
  'theme_system',
  'built',
  'content',
  'erudit',
  'add_translation',
  'main_page',
  'contributors',
  'sponsors',
  'search_the_site',
  'searching_more',
  'no_results',
  'no_more_results',
  'no_content',
  'to_index',
  'about_textbook',
  'flag_title_dev',
  'flag_title_advanced',
  'flag_title_secondary',
);
</script>

<template>
  <section class="relative flex-1 overflow-clip">
    <TransitionSlide :direction>
      <KeepAlive>
        <component :key="asideMajorPane" :is="activePaneComponent" />
      </KeepAlive>
    </TransitionSlide>
  </section>
</template>
