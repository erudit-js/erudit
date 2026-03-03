type LastChangedSource =
  | { type: 'date'; value: string }
  | { type: 'github'; url: string; path: string };

function useLastChangedSource(
  contentRelativePath: MaybeRefOrGetter<string | undefined>,
) {
  return computed((): LastChangedSource | undefined => {
    const path = toValue(contentRelativePath);
    if (!path) return undefined;

    const debug = ERUDIT.config.debug.fakeApi.lastChanged;
    if (debug === true) return { type: 'date', value: '2024-01-15T12:00:00Z' };
    if (typeof debug === 'string') return { type: 'date', value: debug };

    const repo = ERUDIT.config.repository;
    if (!repo || repo.type !== 'github') return undefined;
    const parts = repo.name.split('/');
    if (parts.length !== 2) return undefined;
    const [owner, repoName] = parts;

    return {
      type: 'github',
      url: `https://api.github.com/repos/${owner}/${repoName}/commits`,
      path: `content/${path}`,
    };
  });
}

export function useLastChanged(
  contentRelativePath: MaybeRefOrGetter<string | undefined>,
) {
  const source = useLastChangedSource(contentRelativePath);
  const date = ref<Date | undefined>(undefined);

  onMounted(async () => {
    const s = source.value;
    if (!s) return;

    if (s.type === 'date') {
      date.value = new Date(s.value);
      return;
    }

    if (s.type === 'github') {
      try {
        const data = await $fetch<any[]>(s.url, {
          query: { path: s.path, per_page: 1 },
          responseType: 'json',
        });
        if (Array.isArray(data) && data[0]?.commit?.committer?.date) {
          date.value = new Date(data[0].commit.committer.date);
        }
      } catch {
        // silently ignore API errors
      }
    }
  });

  return date;
}
