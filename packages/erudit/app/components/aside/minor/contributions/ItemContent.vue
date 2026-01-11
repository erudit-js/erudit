<script lang="ts" setup>
import type { ContributorContributionContent } from '@erudit-js/core/content/contributions';

defineProps<{
    content: ContributorContributionContent;
    insideBook?: boolean;
}>();
</script>

<template>
    <TreeItem
        :icon="ICONS[content.type]"
        :to="content.link"
        :main="formatText(content.title)"
        :level="insideBook ? 1 : 0"
    />
</template>
