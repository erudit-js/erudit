<script lang="ts" setup>
import type { ContentBookData } from '@erudit/shared/content/data/type/book';
import type { MyIconName } from '#my-icons';

import ContentDecoration from '@app/components/main/utils/ContentDecoration.vue';
import Breadcrumb from '@app/components/main/utils/Breadcrumb.vue';
import ContentTitle from '@app/components/main/utils/ContentTitle.vue';
import ContentDescription from '@app/components/main/utils/ContentDescription.vue';
import ContentPopovers from '@app/components/main/utils/ContentPopovers.vue';

const bookData = await useContentData<ContentBookData>();
await useContentPage(bookData);

const phrase = await usePhrases('book');
</script>

<template>
    <ContentDecoration
        v-if="bookData.generic.decoration"
        :decoration="bookData.generic.decoration"
    />

    <Breadcrumb
        v-if="bookData.generic.context?.length > 1"
        :context="bookData.generic.context"
    />

    <ContentTitle
        :title="
            bookData.generic?.title ||
            bookData.generic.contentId.split('/').pop()!
        "
        :icon="<MyIconName>'outline/book'"
        :hint="phrase.book"
    />

    <ContentDescription
        v-if="bookData.generic?.description"
        :description="bookData.generic?.description"
    />

    <ContentPopovers :generic="bookData.generic" />

    <!-- Counters, fancy "GO LEARN" button and etc. -->

    <div style="clear: both"></div>
</template>
