<script lang="ts" setup>
import eruditConfig from '#erudit/config';

const baseUrlPath = useBaseUrlPath();

const phrase = await usePhrases('site_info_title', 'site_info_slogan');

interface SiteInfo {
    title: string;
    slogan?: string;
    logotype?: string;
}

const siteInfo = computed<SiteInfo>(() => {
    if (!eruditConfig.site)
        return {
            logotype: eruditAsset('logotype.svg'),
            title: phrase.site_info_title,
            slogan: phrase.site_info_slogan,
        };

    return {
        logotype: eruditConfig.site?.logotype || eruditAsset('logotype.svg'),
        title: eruditConfig.site?.title || phrase.site_info_title,
        slogan: eruditConfig.site?.slogan || phrase.site_info_slogan,
    };
});
</script>

<template>
    <section :class="$style.siteInfo">
        <EruditLink v-if="siteInfo.logotype" to="/" :class="$style.logo">
            <img :src="baseUrlPath(siteInfo.logotype)" :alt="siteInfo.title" />
        </EruditLink>
        <div :class="[$style.textInfo, !siteInfo.logotype && $style.noLogo]">
            <div :class="$style.title">
                <EruditLink to="/">{{
                    siteInfo.title || phrase.site_info_title
                }}</EruditLink>
            </div>
            <div v-if="siteInfo.slogan" :class="$style.description">
                {{ siteInfo.slogan }}
            </div>
        </div>
    </section>
</template>

<style lang="scss" module>
.siteInfo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap);
    padding: var(--gap);
    padding-bottom: var(--gapSmall);
}

.logo {
    width: 50px;
    height: 50px;
}

.textInfo {
    display: flex;
    flex-direction: column;

    &.noLogo {
        text-align: center;
    }

    .title {
        font-weight: bold;
        font-size: 1.25em;
        color: var(--text);

        a {
            @include hoverLink;
        }
    }

    .description {
        color: var(--textMuted);
    }
}
</style>
