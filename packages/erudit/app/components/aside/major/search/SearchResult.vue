<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

const { result } = defineProps<{ result: SearchEntry }>();

const icon: MaybeMyIconName = (() => {
    switch (result.category) {
        case 'contributors':
            return 'user';
        case 'book':
            return 'book-outline';
        case 'page':
            return 'lines';
        case 'topic':
            return 'lines-array';
        case 'group':
            return 'folder-open';
        default:
            return '__missing';
    }
})();
</script>

<template>
    <li>
        <AsideListItem :to="result.link">
            <div
                class="p-normal text-text-muted hocus:text-text text-sm transition-[color]"
            >
                <div class="gap-normal flex">
                    <MaybeMyIcon
                        :name="icon"
                        class="relative top-[3px] shrink-0"
                    />
                    <div>{{ result.title }}</div>
                </div>
                <div>
                    <div
                        v-if="result.description"
                        class="text-text-dimmed pt-small text-xs"
                    >
                        {{ result.description }}
                    </div>
                    <div
                        v-if="result.synonyms?.length"
                        class="pt-small flex flex-wrap gap-[8px] text-xs"
                    >
                        <span
                            v-for="synonym in result.synonyms"
                            class="text-text-dimmed rounded bg-neutral-200 px-[5px] py-[3px] dark:bg-neutral-800"
                        >
                            {{ synonym }}
                        </span>
                    </div>
                    <div
                        v-if="result.location"
                        class="text-text-dimmed pt-small gap-small flex items-center text-xs italic"
                    >
                        <MyIcon name="arrow/up-to-right" />
                        {{ result.location }}
                    </div>
                </div>
            </div>
        </AsideListItem>
    </li>
</template>
