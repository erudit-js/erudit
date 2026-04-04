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
    <nav
      v-if="mode === 'single'"
      :aria-label="phrase.key_elements"
      class="px-main py-main-half"
    >
      <MainSubTitle :title="phrase.key_elements + ':'" />
      <ul
        :style="{ '--keyBg': 'var(--color-bg-aside)' }"
        class="gap-small micro:gap-normal micro:justify-start m-0 flex list-none
          flex-wrap justify-center p-0"
      >
        <li v-for="keyLink of keyLinks">
          <MainKeyLink :keyLink />
        </li>
      </ul>
    </nav>
    <div
      v-else
      :style="{ '--keyBg': 'var(--color-bg-main)' }"
      class="gap-small text-main-sm micro:justify-start flex flex-wrap
        justify-center"
    >
      <MainKeyLink v-for="keyLink of keyLinks" :keyLink />
    </div>
  </template>
</template>
