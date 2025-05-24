<script lang="ts" setup>
import { type ContentContributor } from '@shared/contributor';
import { createContributorLink } from '@shared/link';

defineProps<ContentContributor>();
</script>

<template>
    <EruditLink
        :prefetch="false"
        :class="$style.contributor"
        :to="createContributorLink(contributorId)"
    >
        <ContributorAvatar :contributorId :avatar />
        <span>{{ displayName || contributorId }}</span>
    </EruditLink>
</template>

<style lang="scss" module>
.contributor {
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: var(--gap);
    color: var(--text);
    text-decoration: none;

    @include transition(background);

    &:hover {
        background: var(--bgAccent);
    }
}
</style>
