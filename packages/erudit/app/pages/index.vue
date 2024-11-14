<script lang="ts" setup>
import eruditConfig from '#erudit/config';

const phrase = await usePhrases('seo_index_title', 'seo_index_description');

const seoTitle =
    eruditConfig.seo?.indexTitle ||
    eruditConfig.seo?.title ||
    phrase.seo_index_title;
const seoDescription =
    eruditConfig.seo?.indexDescription || phrase.seo_index_description;

useSeoMeta({
    title: seoTitle,
    ogTitle: seoTitle,
    description: seoDescription,
    ogDescription: seoDescription,
});
</script>

<template>
    <div style="padding: var(--_pMainY) var(--_pMainX)">
        <h1>
            {{
                eruditConfig.seo?.title ||
                eruditConfig.site?.title ||
                phrase.seo_index_title
            }}
        </h1>
        <p>TODO</p>
    </div>
</template>
