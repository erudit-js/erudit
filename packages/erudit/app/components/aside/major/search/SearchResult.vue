<script lang="ts" setup>
import { isContentType } from '@erudit-js/core/content/type';

import type { MaybeMyIconName, MyIconName } from '#my-icons';

const { result, query } = defineProps<{ result: SearchEntry; query: string }>();

const route = useRoute();
const router = useRouter();
const loadingSvg = useLoadingSvg();

const ELEMENT_PREFIX = 'element:';
const isElementCategory = result.category?.startsWith(ELEMENT_PREFIX);

const immediateIcon: MaybeMyIconName = (() => {
  if (isElementCategory) {
    return loadingSvg;
  }

  if (isContentType(result.category)) {
    return ICONS[result.category];
  }

  switch (result.category) {
    case 'contributors':
      return 'user';
    default:
      return '__missing';
  }
})();

const iconKey = ref(0);
const icon = ref<MaybeMyIconName>(immediateIcon);

watch(icon, () => {
  iconKey.value += 1;
});

async function requestElementIcon(elementName: string) {
  icon.value = loadingSvg;

  try {
    icon.value = await getElementIcon(elementName);
  } catch {
    icon.value = '__missing' satisfies MyIconName;
  }
}

if (isElementCategory) {
  const elementName = result.category!.slice(ELEMENT_PREFIX.length);
  requestElementIcon(elementName);
}

function splitQueryTokens(input: string) {
  return input.toLowerCase().trim().split(/\s+/g).filter(Boolean);
}

function scoreTokenMatches(tokens: string[], haystack: string) {
  // Basic forward look: query is space-separated, treat each token as substring.
  const text = haystack.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (text.includes(token)) score += 1;
  }
  return score;
}

const matchedSynonym = computed(() => {
  if (!query) return undefined;
  if (!result.synonyms?.length) return undefined;

  const tokens = splitQueryTokens(query);
  if (tokens.length === 0) return undefined;

  // If title already matches any query token, keep normal title.
  if (scoreTokenMatches(tokens, result.title) > 0) return undefined;

  // Otherwise pick the synonym with best token match score.
  let bestSynonym: string | undefined;
  let bestScore = 0;
  for (const synonym of result.synonyms) {
    const score = scoreTokenMatches(tokens, synonym);
    if (score > bestScore) {
      bestScore = score;
      bestSynonym = synonym;
    }
  }

  return bestScore > 0 ? bestSynonym : undefined;
});

const primaryTitle = computed(() => matchedSynonym.value ?? result.title);
const secondaryTitle = computed(() =>
  matchedSynonym.value ? result.title : undefined,
);

async function searchResultClick() {
  const linkUrl = new URL(result.link, 'http://x');
  const elementId = linkUrl.searchParams.get('element');

  if (elementId) {
    // Clear the element param first so watchers re-trigger scroll/highlight.
    linkUrl.searchParams.delete('element');
    const withoutElement =
      linkUrl.pathname + (linkUrl.search || '') + (linkUrl.hash || '');
    await router.replace({
      ...route,
      query: { ...route.query, element: undefined },
    });
    await navigateTo(withoutElement);
    await nextTick();
  }

  await navigateTo(result.link);
}
</script>

<template>
  <li>
    <AsideListItem @click="searchResultClick">
      <div
        class="group p-normal text-text-muted hocus:text-text text-sm
          transition-[color]"
      >
        <div
          v-if="secondaryTitle"
          class="text-text-muted pb-small gap-small flex items-center text-xs"
        >
          <MyIcon
            name="arrow/up-to-right"
            class="relative top-[4px] shrink-0 rotate-90 text-[1.3em]"
          />
          {{ formatText(secondaryTitle) }}
        </div>
        <div class="gap-small text-text flex items-center">
          <div class="relative size-[1.2em] shrink-0">
            <TransitionFade>
              <MaybeMyIcon
                :name="icon"
                :key="iconKey"
                class="absolute top-px left-0 size-full"
              />
            </TransitionFade>
          </div>
          <div>
            {{ formatText(primaryTitle) }}
          </div>
        </div>
        <div>
          <div
            v-if="result.description"
            class="text-text-dimmed pt-small text-xs"
          >
            {{ formatText(result.description) }}
          </div>
          <div
            v-if="result.location"
            class="text-text-dimmed pt-small gap-small flex items-center text-xs
              italic"
          >
            <MyIcon name="arrow/up-to-right" class="shrink-0 text-[1.3em]" />
            {{ formatText(result.location) }}
          </div>
        </div>
      </div>
    </AsideListItem>
  </li>
</template>
