<script lang="ts" setup>
import type { ContentBookData } from '@erudit/shared/content/data/type/book';
import type { MyIconName } from '#my-icons';

import ContentBreadcrumb from '@app/components/main/content/ContentBreadcrumb.vue';
import ContentDecoration from '@app/components/main/content/ContentDecoration.vue';
import ContentPopovers from '@app/components/main/content/ContentPopovers.vue';

const bookData = await useContentData<ContentBookData>();
await useContentPage(bookData);

const phrase = await usePhrases('book');
</script>

<template>
    <ContentDecoration
        v-if="bookData.generic.decoration"
        :decoration="bookData.generic.decoration"
    />

    <ContentBreadcrumb :context="bookData.generic.context" />

    <MainTitle
        :title="
            bookData.generic?.title ||
            bookData.generic.contentId.split('/').pop()!
        "
        :icon="<MyIconName>'outline/book'"
        :hint="phrase.book"
    />

    <MainDescription
        v-if="bookData.generic?.description"
        :description="bookData.generic?.description"
    />

    <ContentPopovers :generic="bookData.generic" />

    <!-- Counters, fancy "GO LEARN" button and etc. -->

    <div style="clear: both"></div>
</template>
