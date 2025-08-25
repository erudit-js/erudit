<script lang="ts" setup>
import type { EruditTranslations } from '@erudit-js/cog/schema';

const currentLanguage = ERUDIT.config.project.language.current;
const translations = ERUDIT.config.project.language.translations;
const contribute = ERUDIT.config.project.language.contribute;

const sortedTranslations = <EruditTranslations>(() => {
    if (!translations || !currentLanguage) {
        return {};
    }

    const { [currentLanguage]: current, ...rest } = translations;

    if (current) {
        const sortedRestEntries = Object.entries(rest).sort(([a], [b]) =>
            a.localeCompare(b),
        );
        return <EruditTranslations>{
            [currentLanguage]: current,
            ...Object.fromEntries(sortedRestEntries),
        };
    }

    return translations;
})();

const phrase = await usePhrases('add_translation');
</script>

<template>
    <AsideMajorPaneTemplate v-if="translations">
        <ScrollHolder direction="rtl">
            <AsideListItem
                v-for="(language, code) in sortedTranslations"
                :main="language.name"
                :to="code !== currentLanguage ? language.link : undefined"
                :hoverable="code !== currentLanguage"
                :active="code === currentLanguage"
                target="_blank"
            >
                <template v-slot:icon>
                    <div class="font-bold uppercase">{{ code }}</div>
                </template>
            </AsideListItem>
            <AsideListItem
                v-if="contribute"
                :to="contribute"
                target="_blank"
                icon="plus-circle"
                :main="phrase.add_translation"
            />
        </ScrollHolder>
    </AsideMajorPaneTemplate>
</template>
