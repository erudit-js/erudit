<script lang="ts" setup>
import type { PageSponsor } from '@erudit-js/core/sponsor';

const nuxtApp = useNuxtApp();
const payloadKey = 'page-sponsors';
const pageSponsors: PageSponsor[] =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
        await $fetch('/api/pageSponsors', { responseType: 'json' }));

const phrase = await usePhrases(
    'sponsors',
    'sponsors_description',
    'become_sponsor',
    'no_sponsors',
);
</script>

<template>
    <MainSection>
        <MainGlow />
        <MainTitle icon="diamond" :title="phrase.sponsors" />
        <MainDescription :description="phrase.sponsors_description" />
        <div class="h-(--_pMainY)"></div>
        <MainAction
            icon="diamond"
            :label="phrase.become_sponsor"
            :link="ERUDIT.config.project.sponsors!.becomeSponsorLink"
        />
        <div class="h-(--_pMainY)"></div>
    </MainSection>
    <MainSection>
        <div
            v-if="pageSponsors.length > 0"
            class="gap-small micro:gap-normal columns-[300px] px-(--_pMainX)
                py-[calc(var(--_pMainY)/2)]"
        >
            <FancyCard
                v-for="pageSponsor of pageSponsors"
                :key="pageSponsor.name"
                :title="pageSponsor.name"
                :mediaUrl="
                    pageSponsor.avatarUrl
                        ? withBaseUrl(pageSponsor.avatarUrl)
                        : undefined
                "
                :description="pageSponsor.info"
                :link="
                    pageSponsor.link
                        ? { href: pageSponsor.link, external: true }
                        : undefined
                "
                :color="pageSponsor.color"
            >
                <template #tags>
                    <FancyCardTag v-if="pageSponsor.group || pageSponsor.icon">
                        <MaybeMyIcon
                            v-if="pageSponsor.icon"
                            :name="pageSponsor.icon"
                            class="text-[1.2em]"
                        />
                        <span v-if="pageSponsor.group">
                            {{ formatText(pageSponsor.group) }}
                        </span>
                    </FancyCardTag>
                    <FancyCardTag v-if="pageSponsor.link">
                        <MyIcon name="arrow/outward" class="text-[1.2em]" />
                    </FancyCardTag>
                </template>
            </FancyCard>
        </div>
        <div
            v-else
            class="text-text-muted px-(--_pMainX) py-(--_pMainY) text-center"
        >
            {{ phrase.no_sponsors }}
        </div>
    </MainSection>
</template>
