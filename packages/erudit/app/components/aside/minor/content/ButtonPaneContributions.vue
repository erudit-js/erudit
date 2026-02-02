<script lang="ts" setup>
import type { ContentContribution } from '@erudit-js/core/content/contributions';

import Contribution from './Contribution.vue';

const withBaseUrl = useBaseUrl();

const { contributions } = defineProps<{
  contributions?: ContentContribution[];
}>();

const buttonContributors = computed(() => {
  if (!contributions) {
    return [];
  }

  return [...contributions]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(4, contributions.length));
});

const moreContributionsNumber = computed(() => {
  if (!contributions) {
    return 0;
  }

  return contributions.length - buttonContributors.value.length;
});

const contributionsOpened = ref(false);
const phrase = await usePhrases('contribution');
</script>

<template>
  <template v-if="contributions">
    <TransitionFade>
      <div
        v-if="contributionsOpened"
        class="absolute top-0 left-0 z-10 h-full w-full"
      >
        <div class="bg-bg-aside flex h-full w-full flex-col justify-end">
          <div class="nice-scrollbars *:border-border overflow-auto *:border-t">
            <Contribution
              v-for="contribution of contributions.sort((a, b) =>
                a.contributorId.localeCompare(b.contributorId),
              )"
              :contribution
            />
          </div>
          <div class="border-border flex items-center border-t py-1 pr-0">
            <div
              class="pl-normal gap-small flex flex-1 items-center text-sm
                font-semibold"
            >
              <span>{{ formatText(phrase.contribution) }}</span>
              <span
                class="text-invert rounded-full bg-neutral-600 px-[8px]
                  py-[2.5px] text-xs font-semibold dark:bg-neutral-300"
                >{{ contributions.length }}</span
              >
            </div>
            <button
              @click="contributionsOpened = false"
              class="text-text-muted hocus:text-text p-normal cursor-pointer
                transition-[color]"
            >
              <MyIcon name="plus" class="rotate-45 text-[24px] leading-none" />
            </button>
          </div>
        </div>
      </div>
    </TransitionFade>
    <AsideListItem
      @click="contributionsOpened = true"
      class="group border-t border-b-0 py-1"
    >
      <template #main>
        <SmartMedia
          v-for="buttonContributor of buttonContributors"
          :url="
            buttonContributor.avatarUrl
              ? withBaseUrl(buttonContributor.avatarUrl)
              : 'user'
          "
          :style="{
            '--mediaColor': stringColor(buttonContributor.contributorId),
          }"
          class="size-[38px] rounded-full"
        />
        <div
          v-if="moreContributionsNumber"
          class="border-border group-hocus:border-text-dimmed grid size-[38px]
            place-items-center rounded-full border-3 border-dashed text-xs
            font-semibold transition-[border,color]"
        >
          +{{ moreContributionsNumber }}
        </div>
      </template>
    </AsideListItem>
  </template>
</template>
