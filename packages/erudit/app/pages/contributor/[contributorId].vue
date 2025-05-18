<script lang="ts" setup>
import { NO_ALIASES } from '@erudit-js/cog/schema';

import eruditConfig from '#erudit/config';
import { type PageContributor } from '@shared/contributor';
import ContentSection from '@app/components/main/content/ContentSection.vue';

const route = useRoute();
const nuxtApp = useNuxtApp();
const contributor = shallowRef<PageContributor>(null as any);
const contributorColor = ref<string>('');
const resolved = computed(() => {
    const title = (() => {
        return contributor.value.displayName || contributor.value.contributorId;
    })();

    return {
        title,
    };
});

let requestCounter = 0;

function getPayloadCache() {
    const payloadKey = 'contributor';
    return (nuxtApp.static.data[payloadKey] ||= nuxtApp.payload.data[
        payloadKey
    ] ||=
        {});
}

async function fetchContributorData(contributorId: string, requestId: number) {
    const payloadCache = getPayloadCache();

    if (!payloadCache[contributorId]) {
        try {
            const data = await $fetch(`/api/contributor/page/${contributorId}`);

            if (requestId === requestCounter) {
                payloadCache[contributorId] = data;
            }
        } catch (error) {
            console.error(
                `Error fetching contributor ${contributorId}:`,
                error,
            );
        }
    }

    contributor.value = payloadCache[contributorId];
    contributorColor.value = stringColor(contributor.value.contributorId);
}

await fetchContributorData(
    route.params.contributorId as string,
    ++requestCounter,
);

const phrase = await usePhrases(
    'contributors',
    'contributor',
    'contributor_description',
    'editor',
);

useHead({
    title:
        resolved.value.title +
        ' | ' +
        (contributor.value.isEditor ? phrase.editor : phrase.contributor) +
        ' - ' +
        (eruditConfig.seo?.title || eruditConfig.site?.title),
});

useSeoMeta({
    ogTitle:
        resolved.value.title +
        ' | ' +
        (contributor.value.isEditor ? phrase.editor : phrase.contributor) +
        ' - ' +
        (eruditConfig.seo?.title || eruditConfig.site?.title),
    description: phrase.contributor_description(resolved.value.title),
});
</script>

<template>
    <MainBreadcrumb
        :items="[
            {
                title: phrase.contributors,
                icon: 'users',
                link: '/contributors',
            },
        ]"
    />
    <header
        :class="$style.header"
        :style="{ ['--contributorColor']: contributorColor }"
    >
        <div style="position: relative">
            <ContributorAvatar
                :class="$style.avatar"
                :contributorId="contributor.contributorId"
                :avatar="contributor.avatar"
            />
            <MyIcon
                v-if="contributor.isEditor"
                name="graduation"
                :class="$style.editorIcon"
                :title="phrase.editor"
            />
        </div>
        <h1 :class="$style.name">
            {{ resolved.title }}
        </h1>
        <div v-if="contributor.slogan" :class="$style.slogan">
            {{ contributor.slogan }}
        </div>
        <div v-if="contributor.links" :class="$style.links">
            <div v-for="(link, label) of contributor.links">
                <a
                    :href="link"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="$style.link"
                >
                    {{ label }}
                </a>
            </div>
        </div>
    </header>
    <ContentSection v-if="contributor.hasDescription">
        <BitranContent
            :context="{
                location: {
                    type: 'contributor',
                    path: contributor.contributorId,
                },
                aliases: NO_ALIASES(),
            }"
        />
    </ContentSection>
</template>

<style lang="scss" module>
@use '$/def/bp';

.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap);
    padding-top: 20px;
    padding-left: var(--gapBig);
    padding-right: var(--gapBig);

    .avatar {
        --_avatarSize: 110px;
        border: 2px solid var(--bgMain);
        outline: 2px solid var(--contributorColor);
        box-shadow: 0 0 100px 100px
            color-mix(in srgb, var(--contributorColor), transparent 90%);
    }

    .editorIcon {
        position: absolute;
        right: 50%;
        transform: translate(50%, -50%);
        color: color-mix(in srgb, var(--text), var(--contributorColor) 50%);
        font-size: 16px;
        background: var(--bgMain);
        padding: 4px;
        border-radius: 50%;
        outline: 2px solid var(--contributorColor);
        cursor: help;
    }

    .name,
    .slogan,
    .links {
        text-align: center;
    }

    .name {
        padding-top: 6px;
        line-height: 1.2;
        font-size: 2em;
        color: color-mix(in srgb, var(--textDeep), var(--contributorColor) 15%);
        text-shadow: 2px 2px
            color-mix(in srgb, var(--contributorColor), transparent 80%);

        @include bp.below('mobile') {
            font-size: 1.8em;
        }
    }

    .slogan {
        font-size: 1.2em;
        font-weight: 600;
        padding-bottom: 8px;
        color: var(--textMuted);
    }

    .links {
        display: flex;
        gap: var(--gap);
        justify-content: center;
        flex-wrap: wrap;

        .link {
            line-height: 2;
            font-size: 1em;
            font-weight: 600;
            color: color-mix(in srgb, var(--text), var(--contributorColor) 20%);
            border: 1.5px solid
                color-mix(in srgb, var(--contributorColor), transparent 50%);
            border-radius: 3px;
            padding: 4px 10px;
            text-decoration: none;

            @include transition(background);

            &:hover {
                background: color-mix(
                    in srgb,
                    var(--contributorColor),
                    transparent 90%
                );
            }
        }
    }
}
</style>
