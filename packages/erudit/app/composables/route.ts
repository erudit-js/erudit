export function useRoutePath() {
  const route = useRoute();
  return computed(() =>
    route.path.endsWith('/') ? route.path : route.path + '/',
  );
}
