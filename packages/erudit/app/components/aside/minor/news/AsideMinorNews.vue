<script lang="ts" setup>
import NewsItem from './NewsItem.vue';

interface NewsCache {
    total?: number;
    items: NewsItem[];
    newIndices: number[];
    nextIndex?: number;
}

const STORAGE_KEY = 'last-viewed-news-date';
const newsTotal = ref(0);
const newsItems = ref<NewsItem[]>([]);
const newNewsItems = ref<Set<number>>(new Set());
const nextBatchIndex = ref<number | undefined>();
const newsLoading = ref(false);

const nuxtApp = useNuxtApp();

function getCache(): NewsCache | undefined {
    return nuxtApp.payload.data['news'] as NewsCache | undefined;
}

function updateCache() {
    nuxtApp.payload.data['news'] = {
        total: newsTotal.value || undefined,
        items: newsItems.value,
        newIndices: Array.from(newNewsItems.value),
        nextIndex: nextBatchIndex.value,
    } as NewsCache;
}

function getLastViewedDate(): string | null {
    return localStorage.getItem(STORAGE_KEY);
}

function updateLastViewedDate(date: string) {
    localStorage.setItem(STORAGE_KEY, date);
}

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

        updateCache();
    } catch (error) {
        console.error('Error fetching news:', error);
    } finally {
        newsLoading.value = false;
    }
}

function handleNewNewsItems(items: NewsItem[]) {
    if (items.length === 0) return;

    const lastViewedDate = getLastViewedDate();
    const latestItemDate = items[0]!.date;

    if (lastViewedDate) {
        const newItems = items
            .map((item, idx) => (item.date > lastViewedDate ? idx : -1))
            .filter((idx) => idx !== -1);

        // Only mark items as new if some (but not all) are new
        if (newItems.length > 0 && newItems.length < items.length) {
            newNewsItems.value = new Set(newItems);
        }
    }

    updateLastViewedDate(latestItemDate);
}

const cache = getCache();
if (cache) {
    newsTotal.value = cache.total || 0;
    newsItems.value = cache.items;
    newNewsItems.value = new Set(cache.newIndices);
    nextBatchIndex.value = cache.nextIndex;
} else {
    await fetchNews(0);
}

const phrase = await usePhrases('news', 'no_news', 'show_more');
</script>

<template>
    <AsideMinorPane>
        <div class="flex h-full w-full flex-col">
            <AsideMinorPlainHeader
                icon="bell"
                :title="phrase!.news"
                :count="newsTotal === 0 ? undefined : newsTotal"
            />
            <section v-if="newsItems.length === 0">
                <AsidePlainMessage :text="phrase.no_news" />
            </section>
            <ScrollHolder class="flex-1">
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
                            hocus:border-text-disabled gap-normal m-auto flex
                            w-auto cursor-pointer items-center rounded border-2
                            border-transparent text-sm transition-[border]"
                    >
                        <MyRuntimeIcon v-if="newsLoading" :svg="loadingSvg" />
                        <span>{{ phrase.show_more }}</span>
                    </button>
                </TransitionFade>
            </ScrollHolder>
        </div>
    </AsideMinorPane>
</template>
