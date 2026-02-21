<script lang="ts" setup>
import type { PageSponsor } from '@erudit-js/core/sponsor';

const { showNewsAside } = useAsideMinor();
showNewsAside();

const withBaseUrl = useBaseUrl();

const nuxtApp = useNuxtApp();
const payloadKey = 'page-sponsors';
const pageSponsors: PageSponsor[] =
  (nuxtApp.static.data[payloadKey] ||=
  nuxtApp.payload.data[payloadKey] ||=
    await fetchJson('/api/pageSponsors'));

const phrase = await usePhrases(
  'sponsors',
  'sponsors_description',
  'become_sponsor',
  'no_sponsors',
);

useStandartSeo({
  title: phrase.sponsors,
  description: phrase.sponsors_description,
  urlPath: PAGES.sponsors,
});
</script>

<template>
  <MainGlow />
  <MainSectionPreamble>
    <MainTitle icon="diamond" :title="phrase.sponsors" />
    <MainDescription :description="phrase.sponsors_description" />
    <div class="h-main-half"></div>
    <MainAction
      icon="diamond"
      :newTab="true"
      :label="phrase.become_sponsor"
      :link="ERUDIT.config.sponsors!.becomeSponsorLink"
    />
    <div class="h-main-half"></div>
  </MainSectionPreamble>
  <MainSection>
    <div
      v-if="pageSponsors.length > 0"
      class="gap-small micro:gap-normal px-main py-main columns-[300px]"
    >
      <FancyCard
        v-for="pageSponsor of pageSponsors"
        :key="pageSponsor.name"
        :title="pageSponsor.name"
        :mediaUrl="
          pageSponsor.avatarUrl ? withBaseUrl(pageSponsor.avatarUrl) : undefined
        "
        :description="pageSponsor.info"
        :link="
          pageSponsor.link
            ? { href: pageSponsor.link, external: true }
            : undefined
        "
        :color="pageSponsor.color"
      >
        <template
          v-if="pageSponsor.group || pageSponsor.icon || pageSponsor.link"
          #tags
        >
          <FancyCardTag v-if="pageSponsor.group || pageSponsor.icon">
            <MaybeMyIcon
              v-if="pageSponsor.icon"
              :name="pageSponsor.icon"
              class="text-[1.2em]"
            />
            <span v-if="pageSponsor.group">
              {{ formatText(pageSponsor.group) }}
            </span>
          </FancyCardTag>
          <FancyCardTag v-if="pageSponsor.link">
            <MyIcon name="arrow/outward" class="text-[1.2em]" />
          </FancyCardTag>
        </template>
      </FancyCard>
    </div>
    <div v-else class="text-text-muted px-main py-main text-center">
      {{ phrase.no_sponsors }}
    </div>
  </MainSection>
</template>
