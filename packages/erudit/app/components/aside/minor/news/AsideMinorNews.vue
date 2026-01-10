<script lang="ts" setup>
import NewsItem from './NewsItem.vue';

const initialLoaded = ref(false);
const showLoadingIcon = ref(false);

const newsTotal = ref(0);
const newsItems = ref<NewsItem[]>([]);
const newNewsItems = ref<Set<number>>(new Set());
const nextBatchIndex = ref<number | undefined>();
const newsLoading = ref(false);
const phrase = ref<{ news: string; no_news: string; show_more: string }>();

const STORAGE_KEY = 'last-viewed-news-date';

const loadingTimeout = setTimeout(() => {
    showLoadingIcon.value = true;
}, 300);

async function fetchNews(index: number) {
    newsLoading.value = true;
    try {
        const newsBatch = await $fetch<NewsBatch>(`/api/news/batch/${index}`, {
            responseType: 'json',
        });

        if (index === 0) {
            newsTotal.value = newsBatch.total!;
            handleNewNewsItems(newsBatch.items);
        }

        newsItems.value = newsItems.value.concat(newsBatch.items);
        nextBatchIndex.value = newsBatch.nextIndex;
    } catch (error) {
        console.error('Error fetching news:', error);
    } finally {
        newsLoading.value = false;
    }
}

function handleNewNewsItems(items: NewsItem[]) {
    if (items.length === 0) return;

    const lastViewedDate = localStorage.getItem(STORAGE_KEY);
    const latestItemDate = items[0]!.date;

    if (!lastViewedDate) {
        // No localStorage value: create it but don't mark items
        localStorage.setItem(STORAGE_KEY, latestItemDate);
        return;
    }

    const newItems: number[] = [];

    items.forEach((item, idx) => {
        if (item.date > lastViewedDate) {
            newItems.push(idx);
        }
    });

    if (newItems.length === items.length) {
        // All items are new: update localStorage but don't mark them
    } else if (newItems.length > 0) {
        // Some items are new: mark them and update localStorage
        newNewsItems.value = new Set(newItems);
    } else {
        // No new items: still update localStorage with latest date
    }

    localStorage.setItem(STORAGE_KEY, latestItemDate);
}

async function fetchPhrases() {
    phrase.value = await usePhrases('news', 'no_news', 'show_more');
}

const newsPromise = fetchNews(0);
const phrasesPromise = fetchPhrases();

Promise.all([newsPromise, phrasesPromise]).then(() => {
    clearTimeout(loadingTimeout);
    initialLoaded.value = true;
});
</script>

<template>
    <AsideMinorPane>
        <TransitionFade>
            <div
                v-if="initialLoaded"
                class="absolute top-0 left-0 flex h-full w-full flex-col"
            >
                <AsideMinorPlainHeader
                    icon="bell"
                    :title="phrase!.news"
                    :count="newsTotal === 0 ? undefined : newsTotal"
                />
                <section v-if="newsItems.length === 0">
                    <p class="text-text-muted p-normal text-center">
                        {{ phrase!.no_news }}
                    </p>
                </section>
                <section class="nice-scrollbars flex-1 overflow-auto">
                    <NewsItem
                        v-for="(item, index) in newsItems"
                        :item
                        :isNew="newNewsItems.has(index)"
                    />
                    <TransitionFade>
                        <button
                            v-if="nextBatchIndex !== undefined"
                            @click="fetchNews(nextBatchIndex)"
                            :disabled="newsLoading"
                            class="my-big px-normal py-small bg-bg-accent
                                hocus:border-text-disabled gap-normal m-auto
                                flex w-auto cursor-pointer items-center rounded
                                border-2 border-transparent text-sm
                                transition-[border,background,color]"
                        >
                            <MyRuntimeIcon
                                v-if="newsLoading"
                                :svg="loadingSvg"
                            />
                            <span>{{ phrase!.show_more }}</span>
                        </button>
                    </TransitionFade>
                </section>
            </div>
            <div
                v-else-if="showLoadingIcon"
                class="absolute top-0 left-0 grid h-full w-full
                    place-items-center"
            >
                <MyRuntimeIcon
                    :svg="loadingSvg"
                    class="text-text-disabled text-[60px]"
                />
            </div>
        </TransitionFade>
    </AsideMinorPane>
</template>
