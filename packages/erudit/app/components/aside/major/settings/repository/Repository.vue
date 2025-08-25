<script lang="ts" setup>
import type { EruditRepositoryType } from '@erudit-js/cog/schema';

const repository = ERUDIT.config.project.repository;
const phrase = await usePhrases('content');

type SecondaryComponents = Record<EruditRepositoryType, any>;

const secondaryComponents = {
    custom: undefined,
    github: defineAsyncComponent(() => import('./SecondaryGitHub.vue')),
} as const satisfies SecondaryComponents;

const SecondaryComponent = repository
    ? secondaryComponents[repository.type]
    : undefined;
</script>

<template>
    <AsideListItem
        v-if="repository"
        icon="draw"
        target="_blank"
        :to="repository._link"
        :main="phrase.content"
    >
        <template v-slot:secondary>
            <div class="text-text-dimmed ps-[8px] text-xs font-[500]">
                <SecondaryComponent v-if="SecondaryComponent" />
            </div>
        </template>
    </AsideListItem>
</template>
