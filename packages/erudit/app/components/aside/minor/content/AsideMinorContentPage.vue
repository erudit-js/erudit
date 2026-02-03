<script lang="ts" setup>
import ButtonPaneContributions from './ButtonPaneContributions.vue';
import ButtonPaneImprove from './ButtonPaneImprove.vue';
import Toc from './Toc.vue';

const { asideMinorState } = useAsideMinor();

const contributions = computed(() => {
  const state = asideMinorState.value as AsideMinorContentContributions;
  return state.contributions?.sort((a, b) =>
    a.contributorId.localeCompare(b.contributorId),
  );
});

const toc = computed(() => {
  return (asideMinorState.value as AsideMinorContentPage).toc;
});

const contentRelativePath = computed(() => {
  return (asideMinorState.value as AsideMinorContentPage).contentRelativePath;
});

const phrase = await usePhrases('page');
</script>

<template>
  <AsideMinorPane>
    <div class="flex h-full w-full flex-col">
      <AsideMinorPlainHeader :icon="ICONS.page" :title="phrase.page" />
      <ScrollHolder class="flex-1">
        <Toc :toc :key="contentRelativePath" />
      </ScrollHolder>
      <ButtonPaneContributions :contributions />
      <ButtonPaneImprove :contentRelativePath contentType="page" />
    </div>
  </AsideMinorPane>
</template>
