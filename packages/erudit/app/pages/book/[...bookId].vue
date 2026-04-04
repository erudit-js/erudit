<script setup lang="ts">
const route = useRoute();
const bookId = Array.isArray(route.params.bookId)
  ? route.params.bookId.join('/')
  : route.params.bookId!;
const contentTypePath = stringifyContentTypePath('book', bookId);
const mainContent = await useMainContent<MainContentBook>(contentTypePath);

const { showNewsAside, showContentContributionsAside } = useAsideMinor();
if (ERUDIT.config.contributors?.enabled) {
  showContentContributionsAside(
    mainContent.contentRelativePath,
    mainContent.type,
    undefined,
    mainContent.contributions,
  );
} else {
  showNewsAside();
}

const phrase = await usePhrases('book', 'begin_learning');
const lastChangedDate = useLastChanged(() => mainContent.lastmod);

await useContentSeo({
  title: mainContent.title,
  description: mainContent.description,
  contentTypePath: {
    type: 'book',
    contentId: mainContent.shortId,
  },
  seo: mainContent.seo,
  breadcrumbs: mainContent.breadcrumbs,
  lastmod: mainContent.lastmod,
  children: mainContent.children,
  contributions: mainContent.contributions,
  flags: mainContent.flags,
  connections: mainContent.connections,
});
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
      icon="book"
      :title="mainContent.title"
      :contentLabel="phrase.book"
    />
    <MainFlags :flags="mainContent.flags" />
    <MainDescription :description="mainContent.description" />
    <MainConnections :connections="mainContent.connections" />
    <MainContentStats
      mode="single"
      :stats="mainContent.stats"
      :lastChangedDate
    />
    <div class="h-main-half"></div>
    <MainAction
      v-if="mainContent.children[0]"
      icon="rocket"
      :label="formatText(phrase.begin_learning)"
      :link="mainContent.children[0].link"
    />
    <div class="h-main-half"></div>
    <MainStickyHeader :mainContent :lastChangedDate />
  </MainSectionPreamble>
  <MainContentChildren :children="mainContent.children" />
  <MainSection>
    <AdsBannerBottom v-if="adsBottomAllowed()" />
  </MainSection>
</template>
