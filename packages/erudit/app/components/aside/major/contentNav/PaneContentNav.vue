<script lang="ts" setup>
import { isContentType, isTopicPart } from '@erudit-js/cog/schema';

import GlobalNav from './GlobalNav.vue';
import BookNav from './BookNav.vue';

const routePath = useRoutePath();

const showBookNav = ref(false);

const { data: globalNavData } = useNuxtData<FrontGlobalContentNav>(
    asideMajorContentNavGlobalKey,
);

const shortContentId = computed(() => {
    const pathParts = routePath.value.split('/');
    pathParts.pop(); // Remove trailing slash part
    pathParts.shift(); // Remove leading slash part

    const type = pathParts.shift();
    if (isContentType(type) || isTopicPart(type)) {
        return pathParts.join('/');
    }

    return undefined;
});

const shortBookId = computed(() => {
    if (!shortContentId.value) {
        return undefined;
    }

    let longestMatch = '';
    for (const bookShortId of globalNavData.value!.bookShortIds) {
        if (shortContentId.value.startsWith(bookShortId)) {
            if (bookShortId.length > longestMatch.length) {
                longestMatch = bookShortId;
            }
        }
    }

    if (longestMatch) {
        showBookNav.value = true;
    }

    return longestMatch || undefined;
});

const bookNavVisible = computed(() => shortBookId.value && showBookNav.value);

provide(asideMajorContentNavSymbol, {
    shortContentId,
    shortBookId,
    showBookNav,
});
</script>

<template>
    <AsideMajorPaneTemplate :scrollable="false">
        <TransitionSlide :direction="bookNavVisible ? 'forward' : 'backward'">
            <KeepAlive>
                <BookNav v-if="bookNavVisible" :shortBookId />
                <GlobalNav v-else />
            </KeepAlive>
        </TransitionSlide>
    </AsideMajorPaneTemplate>
</template>
