<script lang="ts" setup>
import type { ContentBookData } from '@shared/content/data/type/book';

const bookData = await useContentData<ContentBookData>();
await useContentPage(bookData);

const phrase = await usePhrases('book');
</script>

<template>
    <GroupLikePage
        icon="outline/book"
        :contentLabel="phrase.book"
        :generic="bookData.generic"
        :groupLike="bookData.groupLike"
    />
</template>
