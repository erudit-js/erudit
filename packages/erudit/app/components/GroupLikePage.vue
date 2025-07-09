<script lang="ts" setup>
import type { MyIconName } from '#my-icons';
import eruditConfig from '#erudit/config';

import type { ContentGeneric } from '@shared/content/data/base';
import type { ContentGroupLike } from '@shared/content/data/groupLike';

import ContentBreadcrumb from '@app/components/main/content/ContentBreadcrumb.vue';
import ContentDecoration from '@app/components/main/content/ContentDecoration.vue';
import ContentPopovers from '@app/components/main/content/ContentPopovers.vue';

const props = defineProps<{
    icon: MyIconName;
    contentLabel: string;
    generic: ContentGeneric;
    groupLike: ContentGroupLike;
}>();

const pageTitle = computed(() => {
    return props.generic?.title || props.generic.contentId.split('/').pop()!;
});

const phrase = await usePhrases('start_learning', 'topics');
</script>

<template>
    <ContentDecoration
        v-if="generic.decoration"
        :decoration="generic.decoration"
    />

    <ContentBreadcrumb :context="generic.context" />

    <MainTitle :title="pageTitle" :icon :hint="contentLabel" />

    <MainDescription
        v-if="generic?.description"
        :description="generic?.description"
    />

    <StatsGroupLike
        :stats="[
            {
                type: 'custom',
                icon: 'files',
                label: phrase.topics,
                count: groupLike.topicCount,
            },
            ...groupLike.elementStats,
        ]"
    />

    <ContentPopovers :generic />

    <MainActionButton
        icon="rocket"
        :label="phrase.start_learning"
        :link="groupLike.readLink"
    />

    <div style="clear: both"></div>

    <MainToc :toc="groupLike.contentToc" />

    <MainSourcesUsage :usageSet="groupLike.sourceUsageSet" />

    <MainSection v-if="adsAllowed() && eruditConfig.ads?.bottom">
        <AdsBannerBottom />
    </MainSection>
</template>
