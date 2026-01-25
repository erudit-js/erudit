<script lang="ts" setup>
import ContentNavItem from './items/ContentNavItem.vue';

type BookPayloadValue = {
    shortBookId: string;
    frontNav: FrontContentNavBook;
};

const nuxtApp = useNuxtApp();
const asideMajorPane = useAsideMajorPane();
const { shortContentId, shortBookId } = useContentId();
const frontNavBook = shallowRef<FrontContentNavBook>();
const loading = ref(true);

await bookChange();
watch(shortBookId, bookChange);

async function bookChange() {
    if (shortBookId.value === undefined) {
        // Changed to nothing, keep already loaded book nav or loading screen
        return;
    }

    loading.value = true;

    const payloadKey = 'book-content-nav';

    const fetchPayload = async (): Promise<BookPayloadValue> => {
        return {
            shortBookId: shortBookId.value!,
            frontNav: await $fetch(
                `/api/aside/major/frontNav/book/${shortBookId.value}`,
                {
                    responseType: 'json',
                },
            ),
        };
    };

    let payloadValue: BookPayloadValue =
        nuxtApp.static.data[payloadKey] ??
        nuxtApp.payload.data[payloadKey] ??
        (await fetchPayload());

    // Cache it if it came from fetch
    nuxtApp.static.data[payloadKey] ??= payloadValue;
    nuxtApp.payload.data[payloadKey] ??= payloadValue;

    // Refetch if cached payload is for a different book
    if (payloadValue.shortBookId !== shortBookId.value) {
        payloadValue = await fetchPayload();
        nuxtApp.static.data[payloadKey] = payloadValue;
        nuxtApp.payload.data[payloadKey] = payloadValue;
    }

    frontNavBook.value = payloadValue.frontNav;

    loading.value = false;
}

const pharse = await usePhrases('to_index', 'about_textbook');
</script>

<template>
    <AsideMajorPaneTemplate>
        <TransitionFade>
            <div
                v-if="!loading && frontNavBook"
                class="absolute top-0 left-0 flex h-full w-full flex-col"
            >
                <div
                    class="border-border p-normal shrink-0 border-b text-sm
                        font-bold"
                >
                    {{ frontNavBook.title }}
                </div>
                <ScrollHolder direction="rtl" class="flex-1">
                    <div class="border-border border-b">
                        <TreeContainer>
                            <TreeItem
                                icon="arrow/left"
                                :main="pharse.to_index"
                                @click="
                                    asideMajorPane = AsideMajorPane.GlobalNav
                                "
                            />
                            <TreeItem
                                icon="book-question"
                                :main="pharse.about_textbook"
                                :to="frontNavBook.link"
                                :state="
                                    shortContentId === shortBookId
                                        ? 'active'
                                        : undefined
                                "
                            />
                        </TreeContainer>
                    </div>
                    <TreeContainer>
                        <ContentNavItem
                            v-for="navItem in frontNavBook.children!"
                            :navItem
                        />
                    </TreeContainer>
                </ScrollHolder>
            </div>
            <div
                v-else
                class="absolute top-0 left-0 flex h-full w-full items-center
                    justify-center transition-opacity"
            >
                <Loading class="text-text-dimmed text-[65px]" />
            </div>
        </TransitionFade>
    </AsideMajorPaneTemplate>
</template>
