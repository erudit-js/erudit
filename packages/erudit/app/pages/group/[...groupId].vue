<script lang="ts" setup>
import { type BitranLocation } from '@erudit-js/cog/schema';
import eruditConfig from '#erudit/config';

import { type ContentGroupData } from '@shared/content/data/type/group';
import { locationIcon } from '@erudit/shared/icons';

import ContentBreadcrumb from '@app/components/main/content/ContentBreadcrumb.vue';
import ContentDecoration from '@app/components/main/content/ContentDecoration.vue';
import ContentPopovers from '@app/components/main/content/ContentPopovers.vue';
import ContentSection from '@app/components/main/content/ContentSection.vue';

const location = useBitranLocation() as Ref<BitranLocation>;

const groupData = await useContentData<ContentGroupData>();
await useContentPage(groupData);

const phrase = await usePhrases('group');
</script>

<template>
    <ContentDecoration
        v-if="groupData.generic.decoration"
        :decoration="groupData.generic.decoration"
    />

    <ContentBreadcrumb :context="groupData.generic.context" />

    <MainTitle
        :title="
            groupData.generic?.title ||
            groupData.generic.contentId.split('/').pop()!
        "
        :icon="locationIcon(location!)"
        :hint="phrase.group"
    />

    <MainDescription
        v-if="groupData.generic?.description"
        :description="groupData.generic?.description"
    />

    <ContentPopovers :generic="groupData.generic" />

    <div style="clear: both"></div>

    <MainBitranContent :location />

    <ContentSection v-if="adsAllowed() && eruditConfig.ads?.bottom">
        <AdsBannerBottom />
    </ContentSection>
</template>
