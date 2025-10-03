<script setup lang="ts">
import ContentNavItem from './items/ContentNavItem.vue';

const { shortBookId } = defineProps<{ shortBookId?: string }>();
const { shortContentId, showBookNav } = inject(asideMajorContentNavSymbol)!;
const frontNavBook = shallowRef<FrontContentNavBook | undefined>(undefined);

$fetch('/api/aside/major/frontNav/book/' + shortBookId, {
    responseType: 'json',
}).then((data) => {
    frontNavBook.value = data as FrontContentNavBook;
});

const pharse = await usePhrases('to_index', 'about_textbook');
</script>

<template>
    <div class="absolute top-0 left-0 flex h-full w-full flex-col">
        <TransitionFade>
            <div
                v-if="frontNavBook"
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
                                @click="showBookNav = false"
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
                class="text-text-dimmed absolute top-0 left-0 flex h-full w-full
                    items-center justify-center text-[50px]"
            >
                <MyRuntimeIcon :svg="loadingSvg" />
            </div>
        </TransitionFade>
    </div>
</template>
