<script lang="ts" setup>
import type { FrontNav } from '@shared/frontNav';
import {
    getAsideMajorNavPayload,
    insideNavBook,
    navBookId,
    navBookVisible,
} from '@app/scripts/aside/major/nav';

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

//
// Check if inside book from start
//

// Reset server-leaked state from other pages
navBookId.value = undefined;
insideNavBook.value = false;

if (contentRoute.value) {
    for (const bookId of asideMajorNav.booksIds) {
        if (contentRoute.value.contentId.startsWith(bookId)) {
            navBookId.value = bookId;
            insideNavBook.value = true;
            break;
        }
    }
}

onMounted(() => {
    watch(
        contentRoute,
        () =>
            (insideNavBook.value = insideNavBook.value
                ? !!contentRoute.value
                : false),
    );
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
