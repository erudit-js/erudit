type LastChangedSource =
  | { type: 'date'; value: string }
  | { type: 'github'; url: string; path: string };

export function useLastChangedSource(
  contentRelativePath: MaybeRefOrGetter<string | undefined>,
) {
  return computed((): LastChangedSource | null => {
    const path = toValue(contentRelativePath);
    if (!path) return null;

    const debug = ERUDIT.config.debug.fakeApi.lastChanged;
    if (debug === true) return { type: 'date', value: '2024-01-15T12:00:00Z' };
    if (typeof debug === 'string') return { type: 'date', value: debug };

    const repo = ERUDIT.config.repository;
    if (!repo || repo.type !== 'github') return null;
    const parts = repo.name.split('/');
    if (parts.length !== 2) return null;
    const [owner, repoName] = parts;

    return {
      type: 'github',
      url: `https://api.github.com/repos/${owner}/${repoName}/commits`,
      path: `content/${path}`,
    };
  });
}
