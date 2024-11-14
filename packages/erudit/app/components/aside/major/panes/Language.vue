<script lang="ts" setup>
import PaneContentScroll from '../PaneContentScroll.vue';

const phrase = await usePhrases(
    '_language_code',
    '_language_title',
    'add_translation',
);

interface ClientLanguage {
    code: string;
    name: string;
    link?: string;
    active?: boolean;
}

function defineLanguage(clientLanguage: ClientLanguage): ClientLanguage {
    if (phrase._language_code === clientLanguage.code)
        clientLanguage.active = true;

    return clientLanguage;
}

const languages = ref<ClientLanguage[]>([
    defineLanguage({
        code: phrase._language_code,
        name: phrase._language_title,
    }),
]);

const apiLanguages = await useExternalApiLanguages();

for (const [code, data] of Object.entries(apiLanguages) as any) {
    if (code === phrase._language_code) continue;

    languages.value.push({
        code,
        name: data.name,
        link: data.link,
    });
}

function wip() {
    alert(
        'Work in progress. If you want to add your translation, contact me. Telegram: @math_head',
    );
}
</script>

<template>
    <PaneContentScroll>
        <AsideListItem
            v-for="clientLanguage of languages"
            :class="[clientLanguage.active ? $style.active : '']"
            :link="clientLanguage.active ? undefined : clientLanguage.link"
        >
            <div :class="$style.code">{{ clientLanguage.code }}</div>
            <div :class="$style.name">{{ clientLanguage.name }}</div>
        </AsideListItem>
        <AsideListItem
            icon="plus-circle"
            :main="phrase.add_translation"
            @click="wip"
        />
    </PaneContentScroll>
</template>

<style lang="scss" module>
.active {
    color: var(--brand) !important;
    background: transparent !important;
    cursor: default;
}

.code {
    text-transform: uppercase;
    font-weight: 650;
}
</style>
