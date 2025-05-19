<script lang="ts" setup>
import { topicParts, type TopicPart } from '@erudit-js/cog/schema';

import { injectAsideData } from '@app/scripts/aside/minor/state';
import type { AsideMinorTopic } from '@shared/aside/minor';
import { TOPIC_PART_ICON } from '@erudit/shared/icons';

const phrase = await usePhrases('article', 'summary', 'practice');

const topicData = injectAsideData<AsideMinorTopic>();

const currentTopicPart = computed(() => {
    return topicData.value.part as TopicPart;
});
</script>

<template>
    <section :class="$style.topicNav">
        <AsideMinorTopLink
            :title="topicData.previousNext?.previous?.title"
            :link="topicData.previousNext?.previous?.link"
            :icon="'arrow-left'"
        />

        <AsideMinorTopLink
            v-for="topicPart of topicParts"
            :title="phrase[topicPart]"
            :icon="TOPIC_PART_ICON[topicPart]"
            :link="topicData.partLinks?.[topicPart]"
            :active="topicPart === currentTopicPart"
        />

        <AsideMinorTopLink
            :title="topicData.previousNext?.next?.title"
            :link="topicData.previousNext?.next?.link"
            :icon="'arrow-left'"
            class="icon-flip-h"
        />
    </section>
</template>

<style lang="scss" module>
.topicNav {
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: center;
    gap: 10px;
}
</style>
