<script lang="ts" setup>
import { NO_ALIASES } from '@erudit-js/cog/schema';
import eruditConfig from '#erudit/config';

import { type ContentGroupData } from '@shared/content/data/type/group';
import { locationIcon } from '@erudit/shared/icons';
import ContentDecoration from '@app/components/main/utils/ContentDecoration.vue';
import Breadcrumb from '@app/components/main/utils/Breadcrumb.vue';
import ContentTitle from '@app/components/main/utils/ContentTitle.vue';
import ContentDescription from '@app/components/main/utils/ContentDescription.vue';
import ContentPopovers from '@app/components/main/utils/ContentPopovers.vue';
import ContentSection from '@app/components/main/utils/ContentSection.vue';

const location = useBitranLocation();

const groupData = await useContentData<ContentGroupData>();
await useContentPage(groupData);

const content = await useBitranContent(location);
const phrase = await usePhrases('group');
</script>

<template>
    <ContentDecoration
        v-if="groupData.generic.decoration"
        :decoration="groupData.generic.decoration"
    />

    <Breadcrumb
        v-if="groupData.generic.context?.length > 1"
        :context="groupData.generic.context"
    />

    <ContentTitle
        :title="
            groupData.generic?.title ||
            groupData.generic.contentId.split('/').pop()!
        "
        :icon="locationIcon(location!)"
        :hint="phrase.group"
    />

    <ContentDescription
        v-if="groupData.generic?.description"
        :description="groupData.generic?.description"
    />

    <ContentPopovers :generic="groupData.generic" />

    <!-- TODO: List of materials in group -->

    <div style="clear: both"></div>

    <hr style="display: none" />

    <ContentSection>
        <BitranContent
            :content
            :context="{ location, aliases: NO_ALIASES() }"
        />
    </ContentSection>

    <ContentSection v-if="eruditConfig.ads?.bottom">
        <AdsBannerBottom />
    </ContentSection>
</template>
