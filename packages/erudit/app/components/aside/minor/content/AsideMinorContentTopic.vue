<script lang="ts" setup>
import { topicParts } from '@erudit-js/core/content/topic';
import ButtonPaneContributions from './ButtonPaneContributions.vue';
import ButtonPaneImprove from './ButtonPaneImprove.vue';
import Toc from './Toc.vue';
import TopicPartButton from './TopicPartButton.vue';

const { asideMinorState } = useAsideMinor();

const topicPart = computed(() => {
    return (asideMinorState.value as AsideMinorContentTopic).topicPart;
});

const availableTopicParts = computed(() => {
    const state = asideMinorState.value as AsideMinorContentTopic;
    return state.parts;
});

const shortContentId = computed(() => {
    return (asideMinorState.value as AsideMinorContentTopic).shortContentId;
});

const contributions = computed(() => {
    const state = asideMinorState.value as AsideMinorContentContributions;
    return state.contributions
        ?.slice()
        .sort((a, b) => a.contributorId.localeCompare(b.contributorId));
});

const toc = computed(() => {
    return (asideMinorState.value as AsideMinorContentTopic).toc;
});

const contentRelativePath = computed(() => {
    return (asideMinorState.value as AsideMinorContentTopic)
        .contentRelativePath;
});
</script>

<template>
    <AsideMinorPane>
        <div class="flex h-full w-full flex-col">
            <div
                class="border-border gap-normal flex justify-center border-b
                    transition-[border]"
            >
                <TopicPartButton
                    v-for="part of topicParts"
                    :part
                    :active="part === topicPart"
                    :link="
                        availableTopicParts.includes(part)
                            ? PAGES.topic(part, shortContentId)
                            : undefined
                    "
                />
            </div>
            <ScrollHolder class="flex-1">
                <Toc :toc :key="contentRelativePath + '/' + topicPart" />
            </ScrollHolder>
            <ButtonPaneContributions :contributions />
            <ButtonPaneImprove
                :contentRelativePath
                contentType="topic"
                :topicPart
            />
        </div>
    </AsideMinorPane>
</template>
