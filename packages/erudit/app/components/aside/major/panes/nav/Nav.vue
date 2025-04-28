<script lang="ts" setup>
import type { FrontNav } from '@shared/frontNav';
import {
    getAsideMajorNavPayload,
    insideNavBook,
    navBookId,
    navBookVisible,
} from '@app/scripts/aside/major/nav';

import { detectContentBookId } from '@shared/content/bookId';

import NavGlobal from './NavGlobal.vue';
import NavBook from './NavBook.vue';

const contentRoute = useContentRoute();
const asideMajorNav = getAsideMajorNavPayload();

asideMajorNav.booksIds ||= (await $fetch('/api/aside/major/nav/bookIds', {
    responseType: 'json',
})) as string[];

asideMajorNav.globalNav ||= (await $fetch('/api/aside/major/nav/global', {
    responseType: 'json',
})) as FrontNav;

const checkIfInsideBook = () => {
    if (contentRoute.value) {
        const bookId = detectContentBookId(
            contentRoute.value.contentId,
            asideMajorNav.booksIds
        );

        if (bookId) {
            navBookId.value = bookId;
            insideNavBook.value = true;
            return;
        }
    }

    // If we get here, we're not in any book
    navBookId.value = undefined;
    insideNavBook.value = false;
};

checkIfInsideBook();

onMounted(() => {
    watch(contentRoute, () => {
        checkIfInsideBook();
    });
});
</script>

<template>
    <div :class="[$style.navHolder, navBookVisible && $style.navBookVisible]">
        <NavGlobal :class="$style.navGlobal" />
        <NavBook :class="$style.navBook" />
    </div>
</template>

<style lang="scss" module>
.navHolder {
    position: relative;
    width: 100%;
    height: 100%;

    .navGlobal,
    .navBook {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 1;
        @include transition(left, opacity);
    }

    &.navBookVisible {
        .navGlobal {
            left: calc(-1 * var(--wAside));
            opacity: 0;
        }
    }

    &:not(.navBookVisible) {
        .navBook {
            left: calc(1 * var(--wAside));
            opacity: 0;
        }
    }
}
</style>
