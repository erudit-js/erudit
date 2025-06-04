<script lang="ts" setup>
import eruditConfig from '#erudit/config';
import { createContributorLink } from '@shared/link';

const { data: contributorList } = await useFetch(`/api/contributor/list`, {
    key: 'contributor-list',
});

const editorsNumber = computed(() => {
    return contributorList.value?.filter((i) => i.isEditor)?.length ?? 0;
});

const phrase = await usePhrases(
    'contributors',
    'contributors_page_description',
    'contributors_page_invite',
    'become_contributor',
    'contributions_explain',
    'editor',
);

useEruditHead({
    title: phrase.contributors,
    description: phrase.contributors_page_description,
});

const fullDescription = (() => {
    let _description = phrase.contributors_page_description;

    if (eruditConfig.content?.howToImproveLink) {
        _description += ' ' + phrase.contributors_page_invite;
    }

    return _description;
})();
</script>

<template>
    <MainTitle icon="users" :title="phrase.contributors" />
    <MainDescription
        :class="$style.pageDescription"
        :html="true"
        :description="fullDescription"
    />
    <MainActionButton
        v-if="eruditConfig.content?.howToImproveLink"
        icon="users"
        :label="phrase.become_contributor"
        :link="eruditConfig.content.howToImproveLink"
    />
    <MainSection>
        <section :class="$style.contributors">
            <EruditLink
                :to="createContributorLink(contributor.contributorId)"
                :prefetch="false"
                v-for="(contributor, i) of contributorList"
                :class="$style.contributor"
                :style="{
                    '--contributorColor': stringColor(
                        contributor.contributorId,
                    ),
                }"
            >
                <Avatar
                    icon="user"
                    :src="
                        contributor.avatar
                            ? `/contributors/${contributor.avatar}`
                            : undefined
                    "
                    :class="$style.avatar"
                    :color="stringColor(contributor.contributorId)"
                    :styling="{ glow: true, border: false }"
                />
                <div :class="$style.info">
                    <div :class="$style.main">
                        <div :class="$style.position">
                            <template v-if="contributor.isEditor">
                                <MyIcon
                                    :title="phrase.editor"
                                    :class="$style.editor"
                                    name="graduation"
                                />
                            </template>
                            <template v-else>
                                {{ i - editorsNumber + 1 }}.
                            </template>
                        </div>
                        <div :class="$style.name">
                            {{
                                contributor.displayName ||
                                contributor.contributorId
                            }}
                        </div>
                    </div>
                    <div
                        v-if="contributor.contributions"
                        :class="$style.contributions"
                    >
                        {{
                            phrase.contributions_explain(
                                contributor.contributions,
                            )
                        }}
                    </div>
                </div>
            </EruditLink>
        </section>
    </MainSection>
</template>

<style lang="scss" module>
@use '$/def/bp';

.contributors {
    padding: 0 var(--_pMainX);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
    gap: var(--gap);

    @include bp.below('mobile') {
        padding: var(--_pMainY) 0;
        gap: 0;
    }

    .contributor {
        display: flex;
        align-items: center;
        gap: var(--gap);
        padding: var(--gap);
        border-radius: 5px;
        text-decoration: none;
        color: inherit;
        @include transition(background);

        &:hover {
            background: color-mix(
                in srgb,
                var(--bgMain),
                var(--contributorColor) 12%
            );
        }

        @include bp.below('mobile') {
            border-radius: 0;
        }

        .avatar {
            --avatarSize: 50px;
            flex-shrink: 0;
        }

        .info {
            display: flex;
            flex-direction: column;

            .main {
                display: flex;
                align-items: center;
                gap: 5px;

                .position {
                    font-size: 0.9em;
                    font-weight: 600;
                    color: var(--textMuted);

                    .editor {
                        cursor: help;
                    }
                }

                .name {
                    font-weight: 600;
                }
            }

            .contributions {
                color: var(--textMuted);
                font-size: 0.85em;
            }
        }
    }
}
</style>
