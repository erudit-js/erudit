<script lang="ts" setup>
import type { PageContributor } from '@erudit-js/core/contributor';

const withBaseUrl = useBaseUrl();

const nuxtApp = useNuxtApp();
const route = useRoute();
const contributorId = computed(() => String(route.params.contributorId));

const pageContributor = await (async () => {
  const payloadKey = 'page-contributor';

  const cachedContributor: PageContributor | undefined =
    nuxtApp.static.data[payloadKey] || nuxtApp.payload.data[payloadKey];

  if (cachedContributor?.id === contributorId.value) {
    return cachedContributor;
  }

  let fetchedContributor: PageContributor = await $fetch(
    '/api/contributor/page/' + contributorId.value,
    {
      responseType: 'json',
    },
  );

  fetchedContributor =
    nuxtApp.static.data[payloadKey] =
    nuxtApp.payload.data[payloadKey] =
      fetchedContributor;

  return fetchedContributor;
})();

const { showContributorAside } = useAsideMinor();
showContributorAside(pageContributor.contributions);

const color = stringColor(contributorId.value);
const phrase = await usePhrases(
  'contributors',
  'editor',
  'contributor_page_description',
);

useStandartSeo({
  title: pageContributor.displayName || pageContributor.id,
  description: phrase.contributor_page_description(
    pageContributor.displayName || pageContributor.id,
  ),
  urlPath: PAGES.contributor(contributorId.value),
});
</script>

<template>
  <MainGlow :color />
  <MainSectionPreamble>
    <MainBreadcrumbs
      :breadcrumbs="[
        {
          icon: 'users',
          link: PAGES.contributors,
          title: phrase.contributors,
        },
      ]"
    />
    <div
      :style="{
        '--color': color,
        '--colorBorder':
          'color-mix(in srgb, var(--color), var(--color-border) 70%)',
        '--colorBg':
          'color-mix(in srgb, var(--color), var(--color-bg-main) 85%)',
        '--colorText':
          'color-mix(in srgb, var(--color), var(--color-text) 85%)',
        '--colorIcon':
          'color-mix(in srgb, var(--color), var(--color-text) 30%)',
      }"
      class="px-main py-main-half gap-main flex flex-col items-center"
    >
      <div class="relative">
        <div class="rounded-full ring-2 ring-(--colorBorder)">
          <SmartMedia
            :url="
              pageContributor.avatarUrl
                ? withBaseUrl(pageContributor.avatarUrl)
                : 'user'
            "
            :style="{ '--mediaColor': color }"
            class="border-bg-main micro:size-[110px] size-[80px] rounded-full
              border-2 [box-shadow:0_0_16px_0_var(--color)]"
          />
        </div>
        <div
          v-if="pageContributor.editor"
          :title="phrase.editor"
          class="bg-bg-main micro:size-[28px] absolute bottom-0 left-1/2 z-10
            grid size-[24px] -translate-x-1/2 translate-y-1/2 cursor-help
            place-items-center rounded-full border-2 border-(--colorBorder)"
        >
          <MyIcon name="graduation" class="size-[82%] text-(--colorIcon)" />
        </div>
      </div>
      <div class="gap-normal flex flex-col text-center">
        <h1>
          <FancyBold
            :text="pageContributor.displayName ?? pageContributor.id"
            :color="color"
            class="text-size-h1"
          />
        </h1>
        <div
          v-if="pageContributor.short"
          class="micro:text-[1.3em] text-text-muted relative -top-1 text-[1.1em]
            font-semibold"
        >
          {{ formatText(pageContributor!.short) }}
        </div>
        <div
          v-if="pageContributor.links"
          class="gap-normal flex flex-wrap justify-center"
        >
          <a
            v-for="(link, label) of pageContributor.links"
            :href="link"
            target="_blank"
            class="text-main-sm hocus:bg-(--colorBg) rounded border-2
              border-(--colorBorder) bg-transparent px-2 py-1 font-semibold
              text-(--colorText) transition-[background]"
          >
            {{ formatText(label) }}
          </a>
        </div>
      </div>
    </div>
    <div class="h-main-half"></div>
  </MainSectionPreamble>
  <MainSection v-if="pageContributor.description">
    <Prose
      :element="pageContributor.description.proseElement"
      :storage="pageContributor.description.storage"
      :useHashUrl="false"
    />
  </MainSection>
</template>
