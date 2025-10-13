<script lang="ts" setup>
const siteInfo = ERUDIT.config.project.siteInfo;

const fetchPhrases: LanguagePhraseKey[] = [];

if (!siteInfo.title) {
    fetchPhrases.push('erudit');
}

if (!siteInfo.slogan) {
    fetchPhrases.push('modern_textbook');
}

const phrase = await usePhrases(...fetchPhrases);

const title = siteInfo.title || phrase.erudit;
const slogan = siteInfo.slogan || phrase.modern_textbook;

const logotype = (() => {
    if (siteInfo.logotype === false) {
        return false;
    }

    if (!siteInfo.logotype) {
        return eruditPublic('logotype.svg');
    }

    return String(siteInfo.logotype);
})();
</script>

<template>
    <section
        :class="[
            'p-normal pb-small',
            'mx-auto',
            'flex',
            {
                'gap-normal items-center': siteInfo.brandLayout === 'row',
                'gap-small flex-col': siteInfo.brandLayout === 'column',
                'text-center':
                    siteInfo.brandLayout === 'column' ||
                    siteInfo.logotype === false,
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
                    {{ title }}
                </EruditLink>
            </div>
            <div class="text-text-muted text-sm">{{ slogan }}</div>
        </div>
    </section>
</template>
