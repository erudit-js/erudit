export function useRoutePath() {
    const route = useRoute();
    return computed(() => slasher(route.path, { trailing: true }));
}
