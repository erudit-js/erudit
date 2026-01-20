<script lang="ts" setup>
import PaneSwitcherButton from './PaneSwitcherButton.vue';

const asideMajorPane = useAsideMajorPane();

const translations = ERUDIT.config.project.language.translations;

const underlinePaneIndex = computed(() => {
    const paneIndex = asideMajorPanes.indexOf(asideMajorPane.value);
    return Math.max(paneIndex - 1, 0);
});

const { shortBookId } = useContentId();

const phrase = await usePhrases(
    'content_nav',
    'pages',
    'search',
    'languages',
    'settings',
);
</script>

<template>
    <section class="border-border z-1 border-b">
        <div
            style="--_button-size: 56px; --_underline-p: 6px"
            class="relative mx-auto flex w-max"
        >
            <PaneSwitcherButton
                :pane="
                    shortBookId
                        ? AsideMajorPane.BookNav
                        : AsideMajorPane.GlobalNav
                "
                :hint="phrase.content_nav"
                icon="book"
            />
            <PaneSwitcherButton
                :pane="AsideMajorPane.Pages"
                :hint="phrase.pages"
                icon="file-lines"
            />
            <PaneSwitcherButton
                :pane="AsideMajorPane.Search"
                :hint="phrase.search"
                icon="search/glass"
            />
            <PaneSwitcherButton
                :pane="AsideMajorPane.Settings"
                :hint="phrase.settings"
                icon="cog"
            />
            <PaneSwitcherButton
                v-if="translations"
                :pane="AsideMajorPane.Languages"
                :hint="phrase.languages"
                icon="translate"
            />
            <!-- Active button underline -->
            <div
                :style="`left: calc(${underlinePaneIndex} * var(--_button-size))`"
                :class="'absolute bottom-0 w-(--_button-size) transition-[left]'"
            >
                <div
                    class="bg-text-muted absolute right-(--_underline-p)
                        bottom-[-2px] left-(--_underline-p) h-[3px]
                        rounded-[20px]"
                ></div>
            </div>
        </div>
    </section>
</template>
