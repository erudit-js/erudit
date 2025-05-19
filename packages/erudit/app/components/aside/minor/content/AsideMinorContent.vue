<script lang="ts" setup>
import type { AsideMinorContentBase } from '@shared/aside/minor';
import { injectAsideData } from '@app/scripts/aside/minor/state';

const contentData = injectAsideData<AsideMinorContentBase>();
const phrase = await usePhrases('contributors', 'no_contributors');
const contributePaneVisible = ref(false);

watch(contentData, () => (contributePaneVisible.value = false));
</script>

<template>
    <AsideMinorPane :class="$style.asideMinorContent">
        <section :class="$style.contentNav">
            <AsideMinorTopLink
                :title="contentData.previousNext?.previous?.title"
                :link="contentData.previousNext?.previous?.link"
                :icon="'arrow-left'"
            />

            <div :class="$style.title">
                {{ phrase.contributors }}:
                <span>{{ contentData.contributors?.length || 0 }}</span>
            </div>

            <AsideMinorTopLink
                :title="contentData.previousNext?.next?.title"
                :link="contentData.previousNext?.next?.link"
                :icon="'arrow-left'"
                class="icon-flip-h"
            />
        </section>
        <section v-if="contentData.contributors" :class="$style.contributors">
            <ContributorListItem
                v-for="contributor of contentData.contributors"
                v-bind="contributor"
            />
        </section>
        <section v-else :class="$style.noContributors">
            {{ phrase.no_contributors }}
        </section>
        <AsideMinorContribute v-model:pane="contributePaneVisible" />
    </AsideMinorPane>
</template>

<style lang="scss" module>
.asideMinorContent {
    display: flex;
    flex-direction: column;

    .contentNav {
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;

        .title {
            text-align: center;
            color: var(--text);
            font-size: 1.1em;
            font-weight: 600;
            width: 158px;

            span {
                padding-left: var(--gap);
                color: var(--textMuted);
            }
        }
    }

    .contributors {
        flex: 1;
        overflow: auto;
        @include scroll;

        > * {
            border-bottom: 1px solid var(--border);
        }
    }

    .noContributors {
        flex: 1;
        text-align: center;
        padding: var(--gap);
        color: var(--textMuted);
    }
}
</style>
