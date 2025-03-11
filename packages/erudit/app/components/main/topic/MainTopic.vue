<script lang="ts" setup>
import type { TopicPart } from '@erudit-js/cog/schema';
import { NO_ALIASES } from '@erudit-js/bitran-elements/aliases/shared';

import eruditConfig from '#erudit/config';

import { type ContentTopicData } from '@erudit/shared/content/data/type/topic';
import { topicLocation } from '@app/scripts/aside/minor/topic';

import ContentDecoration from '../utils/ContentDecoration.vue';
import ContentTitle from '../utils/ContentTitle.vue';
import ContentDescription from '../utils/ContentDescription.vue';
import TopicPartSwitch from './TopicPartSwitch.vue';
import Breadcrumb from '../utils/Breadcrumb.vue';
import ContentPopovers from '../utils/ContentPopovers.vue';
import ContentReferences from '../utils/ContentReferences.vue';
import ContentSection from '../utils/ContentSection.vue';
import { TOPIC_PART_ICON } from '@erudit/shared/icons';

const location = useBitranLocation();
const topicPart = computed(() => location.value?.type as TopicPart);

const topicData = await useContentData<ContentTopicData>();
await useContentPage(topicData);

const phrase = await usePhrases('article', 'summary', 'practice');

const content = await useBitranContent(location);

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

    <Breadcrumb
        v-if="topicData.generic.context?.length > 1"
        :context="topicData.generic.context"
    />

    <ContentTitle
        :title="
            topicData.generic?.title ||
            topicData.generic.contentId.split('/').pop()!
        "
        :icon="TOPIC_PART_ICON[location!.type as TopicPart]"
        :hint="phrase[location!.type as TopicPart]"
    />

    <ContentDescription
        v-if="topicData.generic?.description"
        :description="topicData.generic?.description"
    />

    <ContentPopovers :generic="topicData.generic" />

    <TopicPartSwitch
        :partLinks="topicData.topicPartLinks"
        :active="topicPart"
    />

    <div style="clear: both"></div>

    <BitranContent :content :context="{ location, aliases: NO_ALIASES() }" />

    <ContentSection v-if="topicData.generic.references">
        <ContentReferences :references="topicData.generic.references" />
    </ContentSection>

    <AdsBottomBanner v-if="eruditConfig.ads?.bottomBlockId" />
</template>
