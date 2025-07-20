<script lang="ts" setup>
import type {
    FrontNav,
    FrontNavContainer,
    FrontNavItem,
} from '@shared/frontNav';
import { navStateKey, type NavState } from '@app/scripts/aside/major/nav';

import FNavItem from './FNavItem.vue';

const props = defineProps<{ nav: FrontNav; contentId?: string }>();
const hashNav = shallowRef<Record<string, FrontNavItem>>();
const navState = shallowRef<NavState>();

function setupHashNav() {
    hashNav.value = {};

    if (!props.nav) return;

    function addNavItem(navItem: FrontNavItem) {
        hashNav.value![navItem.fullId] = navItem;
        for (const child of (navItem as FrontNavContainer).children || [])
            addNavItem(child);
    }

    for (const topNavItem of props.nav) addNavItem(topNavItem);
}

function setupNavState() {
    // We create a ref for every nav item to check wheter it is active or not.
    // Yes, it uses a lot of memory, but it is still better than messing with recursive tree recreations.

    navState.value = {};

    for (const navItem of Object.values(hashNav.value!))
        navState.value[navItem.id] = shallowRef(null);
}

function updateNavState() {
    // We watch current content route and update navigation state for each item.
    // United watcher here instead of watcher on each navigation item instance.

    if (!hashNav.value || !navState.value) return;

    let currentFullId: string | undefined;
    let longestMatch = '';
    for (const navItem of Object.values(hashNav.value)) {
        navState.value[navItem.id]!.value = null;
        if (
            props.contentId?.startsWith(navItem.id) &&
            navItem.id.length > longestMatch.length
        ) {
            longestMatch = navItem.id;
            currentFullId = navItem.fullId;
        }
    }

    if (!currentFullId) return;

    const idParts = currentFullId.split('/');
    while (idParts.length) {
        const _fullId = idParts.join('/');
        const navItem = hashNav.value[_fullId];

        if (navItem)
            navState.value[navItem.id]!.value =
                _fullId === currentFullId ? 'active' : 'activePart';

        idParts.pop();
    }
}

setupHashNav();
setupNavState();
updateNavState();

watch(
    () => props.nav,
    () => {
        setupHashNav();
        setupNavState();
        updateNavState();
    },
);

watch(() => props.contentId, updateNavState);

// @ts-ignore
provide(navStateKey, navState);

const phrase = await usePhrases('empty_nav');
</script>

<template>
    <TreeContainer v-if="nav && nav.length > 0">
        <slot name="before"></slot>
        <FNavItem v-for="navItem of nav" :navItem />
    </TreeContainer>
    <div v-else :class="$style.emptyNav">
        {{ phrase.empty_nav }}
    </div>
</template>

<style lang="scss" module>
.emptyNav {
    padding: var(--gap);
    color: var(--textMuted);
    text-align: center;
}
</style>
