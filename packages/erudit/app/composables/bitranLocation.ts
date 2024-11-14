import { locationFromPath, type BitranLocation } from '@shared/bitran/location';

export function useBitranLocation(): ComputedRef<BitranLocation | undefined> {
    const route = useRoute();

    return computed(() => locationFromPath(route.path));
}
