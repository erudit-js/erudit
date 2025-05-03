<script lang="ts" setup>
import type { FrontNavBook } from '@shared/frontNav';
import { insideNavBook, navBookId } from '@app/scripts/aside/major/nav';

import PaneContentScroll from '../../PaneContentScroll.vue';
import FNav from './fnav/FNav.vue';
import FNavFlags from './fnav/FNavFlags.vue';
import NavBookLoading from './NavBookLoading.vue';

const loading = ref(true);

const nuxtApp = useNuxtApp();
const contentRoute = useContentRoute();
const book = shallowRef<FrontNavBook>();

async function setupNavBook() {
    loading.value = true;

    if (!navBookId.value) return;

    nuxtApp.runWithContext(() =>
        prerenderRoutes(`/api/aside/major/nav/bookNav/${navBookId.value}`),
    );
    book.value = await $fetch(
        `/api/aside/major/nav/bookNav/${navBookId.value}`,
        { responseType: 'json' },
    );

    loading.value = false;
}

watch(navBookId, setupNavBook);
await setupNavBook();
const pharse = await usePhrases('to_index', 'about_book');
</script>

<template>
    <div>
        <PaneContentScroll v-if="book">
            <section :class="$style.bookHeader">
                <div :class="$style.title">{{ book.label }}</div>
                <FNavFlags
                    v-if="book.flags"
                    :flags="book.flags"
                    :class="$style.flags"
                />
            </section>
            <FNav :nav="book.children!" :contentId="contentRoute?.contentId">
                <template v-slot:before>
                    <section :class="$style.bookActions">
                        <TreeItem
                            icon="arrow-left"
                            :label="pharse.to_index"
                            @click="insideNavBook = false"
                        />
                        <TreeItem
                            icon="book-question"
                            :label="pharse.about_book"
                            :active="contentRoute?.contentId === book.id"
                            :link="`/book/${book.id}`"
                        />
                    </section>
                </template>
            </FNav>
        </PaneContentScroll>
        <TransitionFade>
            <NavBookLoading v-if="loading" />
        </TransitionFade>
    </div>
</template>

<style lang="scss" module>
.bookHeader {
    display: flex;
    align-items: center;
    padding: var(--gap);
    border-bottom: 1px solid var(--border);

    .title {
        flex: 1;
        font-weight: 600;
        color: var(--text);
    }

    .flags {
        flex-shrink: 0;
    }
}

.bookActions {
    border-bottom: 1px solid var(--border);
    padding-bottom: calc(var(--gap)/2);
    margin-bottom: calc(var(--gap)/2);
}
</style>
