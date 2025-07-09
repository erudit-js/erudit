<script lang="ts" setup>
import { CONTENT_TYPE_ICON } from '@shared/icons';
import type { ContentToc, ContentTocItem } from '@shared/content/toc';
import QuickLinks from '../QuickLinks.vue';

defineProps<{ toc: ContentToc }>();

const pretty = useFormatText();
const phrase = await usePhrases('toc', 'topics');

function hasBottom(tocItem: ContentTocItem): boolean {
    if (tocItem.type === 'topic') {
        return tocItem.quickLinks.length > 0;
    }

    if (tocItem.type === 'book' || tocItem.type === 'group') {
        return true;
    }

    return false;
}
</script>

<template>
    <MainSection>
        <MainSectionTitle
            icon="list-squared"
            :title="phrase.toc"
            :count="toc.length"
        />
        <ol :class="$style.tocItems">
            <li v-for="tocItem of toc" :class="$style.tocItem">
                <EruditLink :to="tocItem.link" :class="$style.tocItemHeading">
                    <MyIcon
                        :name="CONTENT_TYPE_ICON[tocItem.type]"
                        :class="$style.tocItemIcon"
                    />
                    <h3>
                        {{ pretty(tocItem.title) }}
                    </h3>
                    <MyIcon name="arrow-left" :class="$style.gotoArrow" />
                </EruditLink>
                <div
                    v-if="tocItem.description"
                    :class="$style.tocItemDescription"
                >
                    {{ pretty(tocItem.description) }}
                </div>
                <div v-if="hasBottom(tocItem)" :class="$style.tocItemBottom">
                    <QuickLinks
                        v-if="
                            tocItem.type === 'topic' &&
                            tocItem.quickLinks.length
                        "
                        :links="tocItem.quickLinks"
                    />
                    <Stats
                        v-if="
                            tocItem.type === 'book' || tocItem.type === 'group'
                        "
                        :stats="[
                            {
                                type: 'custom',
                                icon: 'files',
                                label: phrase.topics,
                                count: tocItem.topicCount,
                            },
                            ...tocItem.stats,
                        ]"
                        :class="$style.tocItemStats"
                    />
                </div>
            </li>
        </ol>
    </MainSection>
</template>

<style lang="scss" module>
.tocItems {
    display: flex;
    flex-direction: column;
    gap: var(--gapBig);
    list-style: none;
    padding: var(--_pMainY) var(--_pMainX);
    margin: 0;
}

.tocItem {
    background: light-dark(#f7f7f7, #282828);
    border-radius: 5px;
    border: 1px solid var(--border);

    .tocItemHeading {
        display: flex;
        align-items: center;
        padding: var(--gap);
        color: inherit;
        text-decoration: none;

        @include transition(color);

        .tocItemIcon {
            color: var(--textMuted);
            margin-right: calc(var(--gap) - 2px);
        }

        .gotoArrow {
            color: var(--textDimmed);
            transform: scaleX(-1);
            opacity: 0;
            @include transition(color, opacity, transform);
        }

        &:hover {
            .gotoArrow {
                color: var(--text);
                opacity: 1;
                transform: scaleX(-1) translateX(-12px);
            }
        }
    }

    .tocItemDescription {
        padding: 0 var(--gap);
        padding-bottom: var(--gap);
    }

    .tocItemBottom {
        padding: var(--gap);
        padding-top: 0;

        .tocItemStats {
            gap: var(--gap);
        }
    }
}
</style>
