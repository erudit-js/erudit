<script lang="ts" setup>
const { mainContent } = defineProps<{
  mainContent: MainContentTopicPart;
}>();

const { showContentTopicAside } = useAsideMinor();

async function proseMounted() {
  await nextTick();
  showContentTopicAside({
    part: mainContent.part,
    parts: mainContent.parts,
    shortContentId: mainContent.shortId,
    contentRelativePath: mainContent.contentRelativePath,
    toc: mainContent.toc,
    contributions: mainContent.contributions,
  });
}

const phrase = await usePhrases(
  'article',
  'summary',
  'practice',
  'article_seo_description',
  'summary_seo_description',
  'practice_seo_description',
);
const lastChangedDate = useLastChanged(() => mainContent.lastmod);

await useContentSeo({
  title: mainContent.title,
  bookTitle: mainContent.bookTitle,
  contentTypeSuffix:
    mainContent.part !== 'article' ? phrase[mainContent.part] : undefined,
  contentTypePath: {
    type: 'topic',
    topicPart: mainContent.part,
    contentId: mainContent.shortId,
  },
  description:
    (mainContent.part === mainContent.parts[0] && mainContent.description) ||
    phrase[`${mainContent.part}_seo_description`](mainContent.title),
  seo: mainContent.seo,
  snippets: mainContent.snippets,
  breadcrumbs: mainContent.breadcrumbs,
  lastmod: mainContent.lastmod,
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
      :icon="ICONS[mainContent.part]"
      :title="mainContent.title"
      :contentLabel="phrase[mainContent.part]"
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
    <template #header>
      <MainTopicPartSwitch
        :shortContentId="mainContent.shortId"
        :parts="mainContent.parts"
        :activePart="mainContent.part"
      />
    </template>
    <template #default>
      <Prose
        :element="mainContent.prose"
        :storage="mainContent.storage"
        :urlPath="'/' + mainContent.fullId"
        :useHashUrl="true"
        :setHtmlIds="true"
        @vue:mounted="proseMounted"
      />
    </template>
  </MainSection>
  <MainSection v-if="adsBottomAllowed()">
    <AdsBannerBottom />
  </MainSection>
</template>
