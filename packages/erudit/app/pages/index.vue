<script lang="ts" setup>
import eruditConfig from '#erudit/config';
import { type IndexData } from '@shared/indexData';
import { normalizeText } from '@erudit/utils/normalize';

const pretty = useFormatText();

const phrase = await usePhrases(
    'seo_index_title',
    'seo_index_description',
    'topics',
    'x_contributors',
    'x_sponsors',
);

const seoTitle = pretty(
    eruditConfig.seo?.indexTitle ||
        eruditConfig.seo?.title ||
        phrase.seo_index_title,
);

const seoDescription = pretty(
    normalizeText(
        eruditConfig.seo?.indexDescription || phrase.seo_index_description,
    ),
);

useSeoMeta({
    title: seoTitle,
    ogTitle: seoTitle,
    description: seoDescription,
    ogDescription: seoDescription,
});

const { data: indexData } = (await useAsyncData('index', () =>
    $fetch('/api/index/data'),
)) as { data: Ref<IndexData> };

const logotype = computed(() => {
    return eruditConfig.index?.logotype
        ? {
              src: eruditConfig.index.logotype.src,
              maxWidth: eruditConfig.index.logotype.maxWidth || '100%',
              invert: eruditConfig.index.logotype.invert,
          }
        : undefined;
});

const title = computed(() => {
    return pretty(
        eruditConfig.index?.title ||
            eruditConfig.seo?.title ||
            eruditConfig.site?.title ||
            phrase.seo_index_title,
    );
});

const slogan = computed(() => {
    return eruditConfig.index?.slogan;
});

const canShowStats = computed(() => {
    const hasElementStats =
        indexData.value.elementStats && indexData.value.elementStats.length > 0;

    const hasTopics =
        indexData.value.topicCount && indexData.value.topicCount > 0;

    return hasElementStats || hasTopics;
});

const description = computed(() => {
    return eruditConfig.index?.description;
});

const canShowParticipants = computed(() => {
    return (
        indexData.value.contributors.length > 0 ||
        indexData.value.sponsors.length > 0
    );
});
</script>

<template>
    <header :class="$style.indexHeader">
        <img
            v-if="logotype"
            :src="logotype.src"
            :style="{ maxWidth: logotype.maxWidth }"
            :class="[
                $style.logotype,
                logotype.invert === 'dark' ? $style.invertDark : '',
                logotype.invert === 'light' ? $style.invertLight : '',
            ]"
        />
        <h1 :class="$style.title">{{ pretty(title) }}</h1>
        <section v-if="slogan" :class="$style.slogan">
            {{ pretty(slogan) }}
        </section>
        <Stats
            v-if="canShowStats"
            :stats="[
                {
                    type: 'custom',
                    icon: 'files',
                    label: phrase.topics,
                    count: indexData.topicCount,
                },
                ...indexData.elementStats,
            ]"
            :class="$style.stats"
        />
        <section v-if="description" :class="$style.description">
            {{ pretty(description) }}
        </section>
        <section v-if="canShowParticipants" :class="$style.participants">
            <IndexAvatars
                v-if="indexData.contributors.length > 0"
                :label="phrase.x_contributors(indexData.contributors.length)"
                link="/contributors/"
                :max="4"
                icon="user"
                :namesAvatars="indexData.contributors"
            />

            <IndexAvatars
                v-if="indexData.sponsors.length > 0"
                :label="phrase.x_sponsors(indexData.sponsors.length)"
                link="/sponsors/"
                :max="4"
                icon="diamond"
                :namesAvatars="indexData.sponsors"
            />
        </section>
    </header>
    <MainToc v-if="indexData.contentToc" :toc="indexData.contentToc" />
</template>

<style lang="scss" module>
@use '$/def/bp';

.indexHeader {
    display: flex;
    flex-direction: column;
    gap: calc(1.5 * var(--_pMainY));
    //padding: var(--_pMainY) 5.5vw;
    padding: var(--_pMainY) var(--_pMainX);

    @include bp.below('mobile') {
        padding: var(--_pMainY) var(--_pMainX);
    }

    .logotype {
        margin: 0 auto;
        margin-bottom: var(--_pMainY);
        width: 100%;

        [data-theme='dark'] &.invertDark,
        [data-theme='light'] &.invertLight {
            filter: invert(1) hue-rotate(180deg);
        }
    }

    .title {
        font-size: clamp(2em, 2vw + 1em, 2.6em);
        text-align: center;
        text-shadow: 3px 3px color-mix(in srgb, var(--brand), transparent 70%);
        line-height: 1;
    }

    .slogan {
        text-align: center;
        font-weight: 600;
        font-size: 1.4em;
        color: var(--textMuted);
    }

    .stats {
        font-size: 1.4em;
        gap: var(--gapBig);
        justify-content: center;

        @include bp.below('mobile') {
            gap: var(--gap);
        }
    }

    .description {
        font-size: 1.1em;
        //text-align: justify;
    }

    .participants {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        gap: var(--gapBig);

        @include bp.below('mobile') {
            gap: var(--gap);
        }
    }
}
</style>
