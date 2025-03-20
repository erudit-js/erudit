import { locationFromPath, type BitranLocation } from '@erudit-js/cog/schema';

export function useBitranLocation(): ComputedRef<BitranLocation | undefined> {
    const route = useRoute();

    return computed(() => locationFromPath(route.path));
}
