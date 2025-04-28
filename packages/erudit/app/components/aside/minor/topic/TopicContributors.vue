<script lang="ts" setup>
import { injectAsideData } from '@app/scripts/aside/minor/state';
import { type AsideMinorTopic } from '@shared/aside/minor';

import AsideOverlayPane from '../../utils/AsideOverlayPane.vue';
import type { ContentContributor } from '@shared/contributor';

const phrase = await usePhrases('contributors');
const topicData = injectAsideData<AsideMinorTopic>();
const listPaneVisible = ref(false);

const showcaseMax = 4;
const showcase = shallowRef<ContentContributor[]>();

const counter = computed(() => {
    const toShow = Math.min(showcaseMax, topicData.value.contributors!.length);

    return {
        showcase: toShow,
        rest: topicData.value.contributors!.length - toShow,
    };
});

let previousFullId: string;

onMounted(() => {
    watch(
        topicData,
        () => {
            if (previousFullId === topicData.value.topicId) return;

            previousFullId = topicData.value.topicId;
            showcase.value = [...topicData.value.contributors!]
                .sort(() => 0.5 - Math.random())
                .slice(0, counter.value.showcase);
            listPaneVisible.value = false;
        },
        { immediate: true },
    );
});
</script>

<template>
    <section :class="$style.topicContributors" @click="listPaneVisible = true">
        <div :class="$style.showcase">
            <template v-if="showcase">
                <ContributorAvatar
                    v-for="contributor of showcase"
                    :contributorId="contributor.contributorId"
                    :avatar="contributor.avatar"
                    :class="$style.avatar"
                />
            </template>
            <template v-else>
                <div
                    v-if="!showcase"
                    v-for="i in counter.showcase"
                    :class="$style.avatarReplacer"
                ></div>
            </template>
        </div>
        <div v-if="counter.rest" :class="$style.restCounter">
            + {{ counter.rest }}
        </div>
    </section>
    <TransitionFade>
        <AsideOverlayPane v-if="listPaneVisible" stick="bottom">
            <div :class="$style.paneList">
                <ContributorListItem
                    v-for="contributor of topicData.contributors"
                    v-bind="contributor"
                />
            </div>
            <div :class="$style.paneFooter">
                <span>{{ phrase.contributors }}:</span>
                <span :class="$style.counter">{{
                    topicData.contributors!.length
                }}</span>
                <span style="flex: 1"></span>
                <MyIcon
                    name="cross"
                    :class="$style.close"
                    @click="listPaneVisible = false"
                />
            </div>
        </AsideOverlayPane>
    </TransitionFade>
</template>

<style lang="scss" module>
.topicContributors {
    border-top: 1px solid var(--border);
    padding: var(--gap);
    display: flex;
    align-items: center;
    gap: var(--gap);
    cursor: pointer;
    background: transparent;

    @include transition(background);

    &:hover {
        background: var(--bgAccent);
    }
}

.showcase {
    $showcaseAvatarSize: 40px;

    display: flex;
    gap: var(--gap);

    .avatar,
    .avatarReplacer {
        width: #{$showcaseAvatarSize};
        height: #{$showcaseAvatarSize};
    }

    .avatarReplacer {
        border-radius: 50%;
        background: var(--textDimmed);
        animation: avatarReplacer 500ms infinite ease-in-out alternate;
    }
}

.restCounter {
    color: var(--textMuted);
    font-size: 1.1em;
    font-weight: 600;
}

@keyframes avatarReplacer {
    from {
        opacity: 0.625;
    }
    to {
        opacity: 0.4;
    }
}

.paneList {
    overflow: auto;
    @include scroll;

    > * {
        border-top: 1px solid var(--border);
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

    .counter {
        color: var(--textMuted);
    }

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
