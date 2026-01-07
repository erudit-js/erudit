<script lang="ts" setup>
import type { ListContributor } from '@erudit-js/core/contributor';

const nuxtApp = useNuxtApp();
const payloadKey = 'list-contributors';
const listContributors: ListContributor[] =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
        await $fetch('/api/contributor/list', { responseType: 'json' }));

const phrase = await usePhrases(
    'contributors',
    'contributors_description',
    'contributors_invite',
    'become_contributor',
    'no_contributors',
    'contribution',
    'editor',
);

const description =
    phrase.contributors_description +
    (ERUDIT.config.project.contributors?.becomeContributorLink
        ? ' ' + phrase.contributors_invite
        : '');
</script>

<template>
    <MainSection>
        <MainGlow />
        <MainTitle icon="users" :title="phrase.contributors" />
        <MainDescription :description />
        <template
            v-if="ERUDIT.config.project.contributors?.becomeContributorLink"
        >
            <div class="h-(--_pMainY)"></div>
            <MainAction
                icon="users"
                :label="phrase.become_contributor"
                :link="'https://google.com'"
            />
            <div class="h-(--_pMainY)"></div>
        </template>
    </MainSection>
    <MainSection>
        <div
            v-if="listContributors.length > 0"
            class="gap-small micro:gap-normal columns-[300px] px-(--_pMainX)
                py-[calc(var(--_pMainY)/2)]"
        >
            <FancyCard
                v-for="contributor of listContributors"
                :key="contributor.id"
                :title="contributor.displayName || contributor.id"
                :mediaUrl="
                    contributor.avatarUrl
                        ? withBaseUrl(contributor.avatarUrl)
                        : undefined
                "
                :description="contributor.short"
                :link="{
                    href: PAGES.contributor(contributor.id),
                    external: false,
                }"
                :color="stringColor(contributor.id)"
            >
                <template
                    #tags
                    v-if="contributor.editor || contributor.contributions"
                >
                    <FancyCardTag v-if="contributor.editor">
                        <MyIcon name="graduation" class="text-[1.2em]" />
                        <span>
                            {{ formatText(phrase.editor) }}
                        </span>
                    </FancyCardTag>
                    <FancyCardTag v-if="contributor.contributions">
                        <MyIcon name="draw" class="text-[1.2em]" />
                        <span>{{ formatText(phrase.contribution) }}</span>
                        <span class="font-bold">
                            {{ contributor.contributions }}
                        </span>
                    </FancyCardTag>
                </template>
            </FancyCard>
        </div>
        <div
            v-else
            class="text-text-muted px-(--_pMainX) py-(--_pMainY) text-center"
        >
            {{ phrase.no_contributors }}
        </div>
    </MainSection>
</template>
