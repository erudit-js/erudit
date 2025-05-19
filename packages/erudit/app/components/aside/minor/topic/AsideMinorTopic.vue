<script lang="ts" setup>
import type { AsideMinorTopic } from '@shared/aside/minor';
import { injectAsideData } from '@app/scripts/aside/minor/state';

import TopicNav from './TopicNav.vue';
import TopicToc from './TopicToc.vue';
import TopicContributors from './TopicContributors.vue';

const topicData = injectAsideData<AsideMinorTopic>();
const contributePaneVisible = ref(false);

watch(topicData, () => (contributePaneVisible.value = false));
</script>

<template>
    <AsideMinorPane :class="$style.asideMinorTopic">
        <TopicNav />
        <TopicToc />
        <TopicContributors v-if="topicData.contributors" />
        <AsideMinorContribute v-model:pane="contributePaneVisible" />
    </AsideMinorPane>
</template>

<style lang="scss" module>
.asideMinorTopic {
    display: flex;
    flex-direction: column;
}
</style>
