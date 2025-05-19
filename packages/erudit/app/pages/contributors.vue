<script lang="ts" setup>
import eruditConfig from '#erudit/config';

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
    'contributions_explain',
    'editor',
);

useHead({
    title:
        phrase.contributors +
        ' - ' +
        (eruditConfig.seo?.title || eruditConfig.site?.title),
});

useSeoMeta({
    title:
        phrase.contributors +
        ' - ' +
        (eruditConfig.seo?.title || eruditConfig.site?.title),
    description: phrase.contributors_page_description,
});

const fullDescription = (() => {
    let _description = phrase.contributors_page_description;

    if (eruditConfig.content?.howToImproveLink) {
        _description +=
            ' ' +
            phrase.contributors_page_invite(
                eruditConfig.content.howToImproveLink,
            );
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
    <section :class="$style.contributors">
        <NuxtLink
            :to="`/contributor/${contributor.contributorId}`"
            :prefetch="false"
            v-for="(contributor, i) of contributorList"
            :class="$style.contributor"
            :style="{
                '--contributorColor': stringColor(contributor.contributorId),
            }"
        >
            <ContributorAvatar
                :contributorId="contributor.contributorId"
                :avatar="contributor.avatar"
                :class="$style.avatar"
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
                            contributor.displayName || contributor.contributorId
                        }}
                    </div>
                </div>
                <div :class="$style.contributions">
                    {{
                        phrase.contributions_explain(contributor.contributions)
                    }}
                </div>
            </div>
        </NuxtLink>
    </section>
</template>

<style lang="scss" module>
@use '$/def/bp';

.pageDescription a {
    color: inherit;
    text-decoration-style: dashed;
    text-decoration-color: var(--textDimmed);

    &:hover {
        text-decoration-style: solid;
        text-decoration-color: var(--text);
    }
}

.contributors {
    padding: var(--_pMainY) var(--_pMainX);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
            background: var(--bgAccent);
        }

        @include bp.below('mobile') {
            border-radius: 0;
        }

        .avatar {
            --_avatarSize: 50px;
            flex-shrink: 0;
            box-shadow: 0 0 5px 5px
                color-mix(in srgb, var(--contributorColor), transparent 85%);
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
