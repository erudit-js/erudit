<script setup lang="ts">
const route = useRoute();
const pageId = Array.isArray(route.params.pageId)
  ? route.params.pageId.join('/')
  : route.params.pageId!;
const contentTypePath = stringifyContentTypePath('page', pageId);
const mainContent = await useMainContent<MainContentPage>(contentTypePath);

const { showContentPageAside } = useAsideMinor();

async function proseMounted() {
  await nextTick();
  showContentPageAside(
    mainContent.contentRelativePath,
    mainContent.toc,
    mainContent.contributions,
  );
}

const lastChangedDate = useLastChanged(() => mainContent.lastmod);

await useContentSeo({
  title: mainContent.title,
  bookTitle: mainContent.bookTitle,
  description: mainContent.description,
  contentTypePath: {
    type: 'page',
    contentId: mainContent.shortId,
  },
  seo: mainContent.seo,
  snippets: mainContent.snippets,
  breadcrumbs: mainContent.breadcrumbs,
  lastmod: mainContent.lastmod,
  contributions: mainContent.contributions,
  flags: mainContent.flags,
  connections: mainContent.connections,
});

const phrase = await usePhrases('page');
</script>

<template>
  <MainGlow />
  <MainSectionPreamble>
    <MainDecoration
      role="preamble-float"
      :decoration="mainContent.decoration"
    />
    <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
    <MainDecoration
      role="preamble-static"
      :decoration="mainContent.decoration"
    />
    <MainTitle
      icon="lines"
      :title="mainContent.title"
      :contentLabel="phrase.page"
    />
    <MainFlags :flags="mainContent.flags" />
    <MainDescription :description="mainContent.description" />
    <MainKeyLinks mode="single" :elementSnippets="mainContent.snippets" />
    <MainConnections :connections="mainContent.connections" />
    <MainContentStats
      mode="single"
      :stats="mainContent.stats"
      :lastChangedDate
    />
    <div class="h-main-half"></div>
    <MainQuoteLoader />
    <div class="h-main-half"></div>
    <MainStickyHeader :mainContent :lastChangedDate />
  </MainSectionPreamble>
  <MainSection>
    <Prose
      :element="mainContent.prose"
      :storage="mainContent.storage"
      :urlPath="'/' + mainContent.fullId"
      :useHashUrl="true"
      :setHtmlIds="true"
      @vue:mounted="proseMounted"
    />
  </MainSection>
  <MainSection v-if="adsBottomAllowed()">
    <AdsBannerBottom />
  </MainSection>
</template>
