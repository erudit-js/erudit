<script lang="ts" setup>
import { type AsideMinorContributor } from '@shared/aside/minor';
import { CONTENT_TYPE_ICON } from '@shared/icons';
import { injectAsideData } from '@erudit/app/scripts/aside/minor/state';

import BookContribution from './BookContribution.vue';

const contributorData = injectAsideData<AsideMinorContributor>();
const phrase = await usePhrases('contribution');

const bookContributions = (() => {
    const grouped: Record<string, typeof contributorData.value.contributions> =
        {};

    contributorData.value.contributions.forEach((contribution) => {
        const bookTitle = contribution.bookTitle || '';
        if (!grouped[bookTitle]) {
            grouped[bookTitle] = [];
        }
        grouped[bookTitle].push(contribution);
    });

    return grouped;
})();

const topLevelContributions = bookContributions[''];
delete bookContributions[''];
</script>

<template>
    <AsideMinorPane>
        <section :class="$style.contributionsHeader">
            {{ phrase.contribution }}:
            <span>{{ contributorData.contributions.length }}</span>
        </section>
        <div :class="$style.contributions">
            <TreeContainer>
                <template v-for="contribution of topLevelContributions">
                    <TreeItem
                        :icon="CONTENT_TYPE_ICON[contribution.contentType]"
                        :label="contribution.contentTitle"
                        :link="contribution.contentLink"
                    />
                </template>
                <BookContribution
                    v-for="(contributions, bookTitle) in bookContributions"
                    :bookTitle
                    :contributions
                />
            </TreeContainer>
        </div>
    </AsideMinorPane>
</template>

<style lang="scss" module>
.contributionsHeader {
    display: flex;
    align-items: center;
    justify-content: center;

    border-bottom: 1px solid var(--border);
    color: var(--text);
    font-size: 1.1em;
    font-weight: 600;
    height: 62px;

    span {
        padding-left: var(--gap);
        color: var(--textMuted);
    }
}

.contributions {
    max-height: calc(100% - 62px);
    overflow-y: auto;
    @include scroll;
}
</style>
