<script lang="ts" setup>
import Contribution from './Contribution.vue';
import ButtonPaneImprove from './ButtonPaneImprove.vue';

const { asideMinorState } = useAsideMinor();

const contentType = computed(() => {
    return (asideMinorState.value as AsideMinorContentContributions)
        .contentType;
});

const topicPart = computed(() => {
    return (asideMinorState.value as AsideMinorContentContributions).topicPart;
});

const contributions = computed(() => {
    const state = asideMinorState.value as AsideMinorContentContributions;
    return state.contributions
        ?.slice()
        .sort((a, b) => a.contributorId.localeCompare(b.contributorId));
});

const contentRelativePath = computed(() => {
    return (asideMinorState.value as AsideMinorContentContributions)
        .contentRelativePath;
});

const phrase = await usePhrases('contribution', 'no_contribution');
</script>

<template>
    <AsideMinorPane>
        <div class="flex h-full w-full flex-col">
            <AsideMinorPlainHeader
                icon="users"
                :title="phrase.contribution"
                :count="contributions?.length"
            />
            <ScrollHolder class="flex-1">
                <div v-if="contributions" class="*:border-border *:border-b">
                    <Contribution
                        v-for="contribution of contributions"
                        :contribution
                    />
                </div>
                <p v-else class="text-text-muted p-normal text-center">
                    {{ phrase.no_contribution }}
                </p>
            </ScrollHolder>
            <ButtonPaneImprove :contentRelativePath :contentType :topicPart />
        </div>
    </AsideMinorPane>
</template>
