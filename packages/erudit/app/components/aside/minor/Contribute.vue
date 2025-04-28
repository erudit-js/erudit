<script lang="ts" setup>
import eruditConfig from '#erudit/config';

import AsideOverlayPane from '../utils/AsideOverlayPane.vue';

const props = defineProps<{ contentId: string }>();
const phrase = await usePhrases(
    'make_contribution',
    'material_improvement',
    'edit_page',
    'how_to_improve',
    'report_problem',
);
const paneVisible = defineModel<boolean>('pane');

const issueLink = computed(() => {
    const ghRepositorty = eruditConfig.repository;
    return ghRepositorty
        ? `https://github.com/${ghRepositorty.name}/issues/`
        : null;
});

const editPageLink = computed(() => {
    const ghRepository = eruditConfig.repository;
    return ghRepository
        ? `https://github.com/${ghRepository.name}/tree/${ghRepository.branch}/content/${props.contentId}`
        : null;
});
</script>

<template>
    <button :class="$style.contribute" @click="paneVisible = true">
        <div :class="$style.icon"><MyIcon name="draw" /></div>
        <div :class="$style.label">{{ phrase.make_contribution }}</div>
    </button>
    <TransitionFade>
        <AsideOverlayPane v-if="paneVisible" stick="bottom">
            <div :class="$style.paneBottomActions">
                <AsideListItem
                    icon="circle-help"
                    :main="phrase.how_to_improve"
                />
                <AsideListItem
                    v-if="issueLink"
                    icon="bug"
                    :main="phrase.report_problem"
                    :link="issueLink"
                    target="_blank"
                />
                <AsideListItem
                    v-if="editPageLink"
                    icon="draw"
                    :main="phrase.edit_page"
                    :link="editPageLink"
                    target="_blank"
                />
            </div>
            <div :class="$style.paneFooter">
                <span>{{ phrase.material_improvement }}</span>
                <span style="flex: 1"></span>
                <MyIcon
                    name="cross"
                    :class="$style.close"
                    @click="paneVisible = false"
                />
            </div>
        </AsideOverlayPane>
    </TransitionFade>
</template>

<style lang="scss" module>
.contribute {
    display: flex;
    gap: var(--gap);
    align-items: center;
    border: none;
    border-top: 1px solid var(--border);
    padding: var(--gap);
    background: transparent;
    cursor: pointer;
    @include transition(background);

    &:hover {
        background: var(--bgAccent);
        .icon {
            border-color: var(--textDimmed);
        }
        .label {
            color: var(--text);
        }
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: 3px dashed var(--border);
        border-radius: 50%;
        color: var(--textMuted);
        @include transition(border-color);
    }

    .label {
        color: var(--textMuted);
        @include transition(color);
    }
}

.paneBottomActions {
    overflow: auto;
    @include scroll;

    > * {
        border-bottom: none !important;
        border-top: 1px solid var(--border);
        min-height: 70px;
    }
}

.paneFooter {
    display: flex;
    align-items: center;
    gap: var(--gap);
    border-top: 1px solid var(--border);
    height: 70px;
    padding-left: var(--gap);
    font-size: 1.1em;
    font-weight: 600;

    .close {
        cursor: pointer;
        padding: var(--gap);
        font-size: 20px;
        color: var(--textMuted);

        @include transition(color);

        &:hover {
            color: var(--text);
        }
    }
}
</style>
