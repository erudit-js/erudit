<script lang="ts" setup>
import { type ContentGroupData } from '@shared/content/data/type/group';

const groupData = await useContentData<ContentGroupData>();
await useContentPage(groupData);

const phrase = await usePhrases('group');
</script>

<template>
    <GroupLikePage
        icon="folder-open"
        :contentLabel="phrase.group"
        :generic="groupData.generic"
        :groupLike="groupData.groupLike"
    />
</template>
