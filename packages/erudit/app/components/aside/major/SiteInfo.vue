<script lang="ts" setup>
const siteInfo = ERUDIT.config.project.siteInfo;

const fetchPhrases: LanguagePhraseKey[] = [];

if (!siteInfo.title) {
    fetchPhrases.push('erudit');
}

if (!siteInfo.short && siteInfo.short !== false) {
    fetchPhrases.push('default_site_info_short');
}

const phrase = await usePhrases(...fetchPhrases);

const title = siteInfo.title || phrase.erudit;
const short =
    siteInfo.short === false
        ? undefined
        : siteInfo.short || phrase.default_site_info_short;

const logotype = (() => {
    if (siteInfo.logotype === false) {
        return false;
    }

    if (!siteInfo.logotype) {
        return eruditPublic('logotype.svg');
    }

    return String(siteInfo.logotype);
})();

const layout = siteInfo.logotype === false ? 'column' : 'row';
</script>

<template>
    <section
        :class="[
            'p-normal pb-small',
            'mx-auto',
            'flex',
            {
                'gap-normal items-center': layout === 'row',
                'gap-small flex-col': layout === 'column',
                'text-center':
                    layout === 'column' || siteInfo.logotype === false,
            },
        ]"
    >
        <EruditLink v-if="logotype !== false" to="/">
            <img :src="withBaseUrl(logotype)" alt="Site logotype" />
        </EruditLink>
        <div>
            <div>
                <EruditLink
                    class="text-hover-underline text-lg font-bold"
                    to="/"
                >
                    {{ formatText(title) }}
                </EruditLink>
            </div>
            <div v-if="short" class="text-text-muted text-sm">
                {{ formatText(short) }}
            </div>
        </div>
    </section>
</template>
