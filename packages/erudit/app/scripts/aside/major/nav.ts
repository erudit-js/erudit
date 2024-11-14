import type { InjectionKey, ShallowRef } from 'vue';
import type { FrontNav } from '@shared/frontNav';

export const insideNavBook = ref(false);
export const navBookId = ref<string>();

export const navBookVisible = computed(() => {
    return insideNavBook.value && navBookId.value;
});

type AsideMajorNav = {
    booksIds: string[];
    globalNav: FrontNav;
};

export function getAsideMajorNavPayload() {
    const key = 'aside-major-nav';
    const nuxtApp = useNuxtApp();
    return (nuxtApp.static.data[key] ||= nuxtApp.payload.data[key] ||=
        {}) as AsideMajorNav;
}

export type NavStateValue = ShallowRef<null | 'active' | 'activePart'>;
export type NavState = { [contentId: string]: NavStateValue };

export const navStateKey = Symbol() as InjectionKey<ShallowRef<NavState>>;
