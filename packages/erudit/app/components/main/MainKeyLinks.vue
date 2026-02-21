<script lang="ts" setup>
const { elementSnippets } = defineProps<{
  mode: 'single' | 'children';
  elementSnippets?: ElementSnippet[];
}>();

const keyLinks = (() => {
  if (!elementSnippets) {
    return;
  }

  const filtered = elementSnippets.filter((snippet) => !!snippet.key);

  return filtered.length > 0 ? filtered : undefined;
})();

const phrase = await usePhrases('key_elements');
</script>

<template>
  <template v-if="keyLinks">
    <section v-if="mode === 'single'" class="px-main py-main-half">
      <MainSubTitle :title="phrase.key_elements + ':'" />
      <div
        :style="{ '--keyBg': 'var(--color-bg-aside)' }"
        class="gap-small micro:gap-normal micro:justify-start flex flex-wrap
          justify-center"
      >
        <MainKeyLink v-for="keyLink of keyLinks" :keyLink />
      </div>
    </section>
    <div
      v-else
      :style="{ '--keyBg': 'var(--color-bg-main)' }"
      class="gap-small text-main-sm flex flex-wrap"
    >
      <MainKeyLink v-for="keyLink of keyLinks" :keyLink />
    </div>
  </template>
</template>
