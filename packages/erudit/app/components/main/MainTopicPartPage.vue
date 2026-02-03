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
  'summary',
  'practice',
  'article_seo_description',
  'summary_seo_description',
  'practice_seo_description',
);

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
    mainContent.part === 'article'
      ? mainContent.description ||
        phrase.article_seo_description(mainContent.title)
      : mainContent.part === 'summary'
        ? phrase.summary_seo_description(mainContent.title)
        : mainContent.part === 'practice'
          ? phrase.practice_seo_description(mainContent.title)
          : undefined,
  seo: mainContent.seo,
  snippets: mainContent.snippets,
});
</script>

<template>
  <MainGlow />
  <MainDecoration :decoration="mainContent.decoration" />
  <MainSectionPreamble>
    <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
    <MainTitle :icon="ICONS[mainContent.part]" :title="mainContent.title" />
    <MainFlags :flags="mainContent.flags" />
    <MainDescription :description="mainContent.description" />
    <MainQuickLinks mode="single" :elementSnippets="mainContent.snippets" />
    <MainConnections :connections="mainContent.connections" />
    <MainContentStats mode="single" :stats="mainContent.stats" />
    <div class="h-main-half"></div>
    <MainQuoteLoader />
    <div class="h-main-half"></div>
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
        :element="mainContent.proseElement"
        :storage="mainContent.storage"
        :urlPath="'/' + mainContent.fullId"
        :useHashUrl="true"
        @vue:mounted="proseMounted"
      />
    </template>
  </MainSection>
  <MainSection v-if="adsBottomAllowed()">
    <AdsBannerBottom />
  </MainSection>
</template>
