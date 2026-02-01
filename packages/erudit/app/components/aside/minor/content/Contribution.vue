<script lang="ts" setup>
import type { ContentContribution } from '@erudit-js/core/content/contributions';

defineProps<{ contribution: ContentContribution }>();

const withBaseUrl = useBaseUrl();
</script>

<template>
    <EruditLink
        :to="PAGES.contributor(contribution.contributorId)"
        class="p-normal hocus:bg-bg-accent block bg-transparent
            transition-[background]"
    >
        <div class="gap-normal flex items-center">
            <SmartMedia
                class="micro:size-[40px] size-[30px] shrink-0 rounded-full"
                :style="{
                    '--mediaColor': stringColor(contribution.contributorId),
                }"
                :url="
                    contribution.avatarUrl
                        ? withBaseUrl(contribution.avatarUrl)
                        : 'user'
                "
            />
            <span class="text-[0.9em]">{{
                contribution.name || contribution.contributorId
            }}</span>
        </div>
        <div
            v-if="contribution.description"
            class="pt-small text-text-muted text-sm"
        >
            {{ formatText(contribution.description) }}
        </div>
    </EruditLink>
</template>
