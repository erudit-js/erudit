<script lang="ts" setup>
import eruditConfig from '#erudit/config';

const { data: sponsors } = await useAsyncData(
    'sponsors',
    () => $fetch('/api/sponsor/list'),
    { deep: false },
);

const phrase = await usePhrases(
    'sponsors',
    'sponsors_description',
    'become_sponsor',
);

useEruditHead({
    title: phrase.sponsors,
    description: phrase.sponsors_description,
});
</script>

<template>
    <MainTitle icon="diamond" :title="phrase.sponsors" />
    <MainDescription :description="phrase.sponsors_description" />
    <MainActionButton
        v-if="eruditConfig.content?.howToImproveLink"
        icon="diamond"
        :label="phrase.become_sponsor"
        :link="eruditConfig.content.howToImproveLink"
    />
    <MainSection :class="$style.sponsorSection" v-if="sponsors?.tier2?.length">
        <template v-slot:header>
            <h2 :class="$style.tierHeading">
                {{ eruditConfig.sponsors!.tier2Label }}
            </h2>
        </template>
        <div :class="$style.tier2Grid">
            <SponsorTier2 v-for="sponsor of sponsors.tier2" :sponsor />
        </div>
    </MainSection>
    <MainSection :class="$style.sponsorSection" v-if="sponsors?.tier1?.length">
        <template v-slot:header>
            <h2 :class="$style.tierHeading">
                {{ eruditConfig.sponsors!.tier1Label }}
            </h2>
        </template>
        <div :class="$style.tier1Grid">
            <SponsorTier1 v-for="sponsor of sponsors.tier1" :sponsor />
        </div>
    </MainSection>
</template>

<style lang="scss" module>
@use '$/def/bp';

.tierHeading {
    padding: var(--gap) var(--_pMainX);
    font-size: 1.4em;

    @include bp.below('mobile') {
        text-align: center;
    }
}

.sponsorSection:nth-child(even of .sponsorSection) {
    .tierHeading {
        padding-bottom: 0;
        padding-top: calc(1.5 * var(--gap));
    }
}

.tier2Grid {
    padding: 0 var(--_pMainX);
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, 310px);
    gap: var(--gap);

    @include bp.below('mobile') {
        padding: var(--_pMainY) 0;
    }
}

.tier1Grid {
    padding: 0 var(--_pMainX);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
    gap: var(--gap);

    @include bp.below('mobile') {
        padding: var(--_pMainY) 0;
        gap: 0;
    }
}
</style>
