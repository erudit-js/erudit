<script lang="ts" setup>
import SearchWorker from './search.worker.ts?worker';
import SearchInput from './SearchInput.vue';
import SearchStatus from './SearchStatus.vue';
import SearchResult from './SearchResult.vue';

const runtimeConfig = useRuntimeConfig();
const withBaseUrl = useBaseUrl();

const loadingSvg = useLoadingSvg();

const phrase = await usePhrases(
  'no_results',
  'searching_more',
  'no_more_results',
);

const STATUS = defineStatuses({
  default: {},
  loading: { icon: loadingSvg },
  searching: { icon: loadingSvg, message: phrase.searching_more },
  nothingFound: { icon: 'search/wtf', message: phrase.no_results },
  noMore: { icon: 'search/check', message: phrase.no_more_results },
  error: (message: string) => ({
    icon: 'search/dead',
    message,
  }),
});

const worker = shallowRef<Worker>() as Ref<Worker>;
const results = shallowRef<SearchEntry[]>([]);
const status = ref<SearchStatusVariant>(STATUS.default);
const query = ref('');

let searchId = 0;

onMounted(() => {
  worker.value = new SearchWorker();

  const initCommand: SearchCommandInit = {
    type: 'init',
    baseUrl: withBaseUrl('/'),
    language: ERUDIT.config.language.current,
    cacheId: String(
      import.meta.dev ? Date.now() : runtimeConfig.public.buildTimestamp,
    ),
  };

  worker.value.postMessage(initCommand);

  worker.value.onmessage = (e) => {
    const response = e.data as SearchResponse;
    switch (response.type) {
      case 'error':
        status.value = STATUS.error(response.message);
        break;
      case 'results':
        results.value = results.value.concat(response.entries);
        status.value =
          results.value.length === 0
            ? STATUS.nothingFound
            : response.hasMore
              ? STATUS.searching
              : STATUS.noMore;
        break;
    }
  };
});

onUnmounted(() => {
  worker.value.terminate();
});

function newSearch(newQuery: string) {
  const trimmed = newQuery.trim();
  query.value = trimmed;

  if (!trimmed) {
    results.value = [];
    status.value = STATUS.default;
    return;
  }

  results.value = [];
  status.value = STATUS.loading;
  const newSearchId = ++searchId;

  const searchCommand: SearchCommandSearch = {
    type: 'search',
    id: newSearchId,
    query: trimmed,
  };

  worker.value.postMessage(searchCommand);
}

function more() {
  if (status.value.id !== 'searching') {
    return;
  }

  const moreCommand: SearchCommandMore = {
    type: 'more',
    id: searchId,
  };

  worker.value.postMessage(moreCommand);
}

function defineStatuses<
  T extends Record<
    string,
    | Omit<SearchStatusVariant, 'id'>
    | ((...a: any[]) => Omit<SearchStatusVariant, 'id'>)
  >,
>(defs: T) {
  const out: Record<string, any> = {};
  for (const [statusId, statusDef] of Object.entries(defs)) {
    if (typeof statusDef === 'function') {
      out[statusId] = (...args: any[]) => ({
        id: statusId,
        ...statusDef(...args),
      });
    } else {
      out[statusId] = { id: statusId, ...statusDef };
    }
  }
  return out as {
    [K in keyof T]: T[K] extends (...a: infer A) => any
      ? (...a: A) => SearchStatusVariant
      : SearchStatusVariant;
  };
}
</script>

<template>
  <AsideMajorPaneTemplate :scrollable="false" class="flex flex-col">
    <SearchInput class="shrink-0" @search="newSearch" />
    <ScrollHolder direction="rtl" class="flex-1">
      <div v-if="results.length">
        <ol>
          <SearchResult
            v-for="result in results"
            :result="result"
            :query="query"
          />
        </ol>
      </div>
      <SearchStatus
        :key="`${status.id}-${results.length}`"
        :statusVariant="status"
        @reach="more"
      />
    </ScrollHolder>
  </AsideMajorPaneTemplate>
</template>
