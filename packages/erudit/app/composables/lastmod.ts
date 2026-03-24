export function useLastChanged(lastmod: MaybeRefOrGetter<string | undefined>) {
  return computed(() => {
    const val = toValue(lastmod);
    return val ? new Date(val) : undefined;
  });
}
