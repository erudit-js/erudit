<script lang="ts" setup>
import { type BitranLocation, type TopicPart } from '@erudit-js/cog/schema';

import eruditConfig from '#erudit/config';

import { type ContentTopicData } from '@shared/content/data/type/topic';
import { TOPIC_PART_ICON } from '@shared/icons';
import { topicLocation } from '@app/scripts/aside/minor/topic';

import ContentBreadcrumb from '@app/components/main/content/ContentBreadcrumb.vue';
import ContentDecoration from '@app/components/main/content/ContentDecoration.vue';
import ContentPopovers from '@app/components/main/content/ContentPopovers.vue';
import ContentReferences from '@app/components/main/content/ContentReferences.vue';
import ContentSection from '@app/components/main/content/ContentSection.vue';
import TopicPartSwitch from './TopicPartSwitch.vue';

const location = useBitranLocation() as Ref<BitranLocation>;
const topicPart = computed(() => location.value?.type as TopicPart);

const topicData = await useContentData<ContentTopicData>();
await useContentPage(topicData);

const phrase = await usePhrases('article', 'summary', 'practice');

onMounted(() => {
    watchEffect(() => {
        // Telling live toc that content is mounted
        topicLocation.value = location.value;
    });
});
</script>

<template>
    <ContentDecoration
        v-if="topicData.generic.decoration"
        :decoration="topicData.generic.decoration"
    />

    <ContentBreadcrumb :context="topicData.generic.context" />

    <MainTitle
        :title="
            topicData.generic?.title ||
            topicData.generic.contentId.split('/').pop()!
        "
        :icon="TOPIC_PART_ICON[location!.type as TopicPart]"
        :hint="phrase[location!.type as TopicPart]"
    />

    <MainDescription
        v-if="topicData.generic?.description"
        :description="topicData.generic?.description"
    />

    <ContentPopovers :generic="topicData.generic" />

    <TopicPartSwitch
        :partLinks="topicData.topicPartLinks"
        :active="topicPart"
    />

    <div style="clear: both"></div>

    <ContentSection>
        <MainBitranContent :location />
    </ContentSection>

    <ContentSection v-if="topicData.generic.references">
        <ContentReferences :references="topicData.generic.references" />
    </ContentSection>

    <ContentSection v-if="adsAllowed() && eruditConfig.ads?.bottom">
        <AdsBannerBottom />
    </ContentSection>
</template>

<style lang="scss" module>
.foo {
    position: relative;
    width: 100%;
    height: 300px;
}
</style>
