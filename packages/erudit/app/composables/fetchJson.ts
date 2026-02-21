export const fetchJson = <T>(...args: Parameters<typeof $fetch<T>>) => {
  const { $fetchJson } = useNuxtApp();
  return $fetchJson(...args) as ReturnType<typeof $fetch<T>>;
};
