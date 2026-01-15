<script lang="ts" setup>
import type { ContentContribution } from '@erudit-js/core/content/contributions';

defineProps<{ contribution: ContentContribution }>();
</script>

<template>
    <EruditLink
        :to="PAGES.contributor(contribution.contributorId)"
        class="p-normal hocus:bg-bg-accent block bg-transparent
            transition-[border,background]"
    >
        <div class="gap-normal flex items-center">
            <SmartMedia
                class="size-[40px] shrink-0 rounded-full"
                :style="{
                    '--mediaColor': stringColor(contribution.contributorId),
                }"
                :url="
                    contribution.avatarUrl
                        ? withBaseUrl(contribution.avatarUrl)
                        : 'user'
                "
            />
            {{ contribution.name || contribution.contributorId }}
        </div>
        <div
            v-if="contribution.description"
            class="pt-small text-text-muted text-sm"
        >
            {{ formatText(contribution.description) }}
        </div>
    </EruditLink>
</template>
