<script lang="ts" setup>
import type { TopicPart } from '@erudit-js/core/content/topic';
import type { ContentType } from '@erudit-js/core/content/type';

const { contentType, contentRelativePath, topicPart } = defineProps<{
    contentRelativePath: string;
    contentType: ContentType;
    topicPart?: TopicPart;
}>();

const optionsOpened = ref(false);

const howToImproveLink = ERUDIT.config.project.contributors?.howToImproveLink;
const reportIssueLink = ERUDIT.config.project.contributors?.reportIssueLink;

const editLink = computed(() => {
    const prefix = ERUDIT.config.project.contributors?.editLinkPrefix;

    if (prefix) {
        const postfix = (() => {
            switch (contentType) {
                case 'book':
                    return '/book.ts';
                case 'page':
                    return '/page.tsx';
                case 'group':
                    return '/group.ts';
                case 'topic':
                    return `/${topicPart!}.tsx`;
            }
        })();

        return `${prefix}${contentRelativePath}${postfix}`;
    }
});

const contributorsEnabled = ERUDIT.config.project.contributors?.enabled;
const canImprove =
    contributorsEnabled && (howToImproveLink || reportIssueLink || editLink);

const phrase = await usePhrases(
    'make_contribution',
    'improve_material',
    'how_to_improve',
    'report_issue',
    'edit_page',
);
</script>

<template>
    <template v-if="canImprove">
        <TransitionFade>
            <div
                v-if="optionsOpened"
                class="absolute top-0 left-0 z-10 h-full w-full"
            >
                <div
                    class="bg-bg-aside flex h-full w-full flex-col justify-end"
                >
                    <div
                        class="nice-scrollbars overflow-auto *:border-t
                            *:border-b-0"
                    >
                        <AsideListItem
                            v-if="howToImproveLink"
                            icon="question-circle"
                            :main="phrase.how_to_improve"
                            :to="howToImproveLink"
                        />
                        <AsideListItem
                            v-if="reportIssueLink"
                            icon="bug"
                            :main="phrase.report_issue"
                            :to="reportIssueLink"
                        />
                        <AsideListItem
                            v-if="editLink"
                            icon="draw"
                            :main="phrase.edit_page"
                            :to="editLink"
                        />
                    </div>
                    <div
                        class="border-border flex items-center border-t py-1
                            pr-0"
                    >
                        <div class="pl-normal flex-1 text-sm font-semibold">
                            {{ formatText(phrase.improve_material) }}
                        </div>
                        <button
                            @click="optionsOpened = false"
                            class="text-text-muted hocus:text-text p-normal
                                cursor-pointer transition-[color]"
                        >
                            <MyIcon
                                name="plus"
                                class="rotate-45 text-[24px] leading-none"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </TransitionFade>
        <AsideListItem
            :main="formatText(phrase.make_contribution)"
            @click="optionsOpened = true"
            class="group border-t border-b-0 py-1"
        >
            <template #icon>
                <div
                    class="border-border group-hocus:border-text-dimmed grid
                        size-[40px] place-items-center rounded-full border-3
                        border-dashed transition-[border]"
                >
                    <MyIcon name="draw" class="text-text-muted size-[56%]" />
                </div>
            </template>
        </AsideListItem>
    </template>
</template>
