<script lang="ts" setup>
import { brandLogotype, brandColors } from 'erudit-cog/utils/brand';

import eruditConfig from '#erudit/config';
import { version } from '@erudit/package.json';
import { AsideType } from '@app/scripts/aside';
import { createOgImageTags, defaultOgImage } from '@app/scripts/og';

const route = useRoute();
const favicon = useFavicon();
const siteUrl = useSiteUrl();
const pageUrl = usePageUrl();
const baseUrlPath = useBaseUrlPath();

const theme = ref({
    brand: 'red',
});

const faviconHref = computed(() => {
    const href = baseUrlPath(favicon.value);

    setTimeout(() => {
        if (import.meta.client)
            document
                .querySelector('link[rel="icon"]')
                ?.setAttribute('href', href); // Force update favicon
    }, 200);

    return href;
});

const phrase = await usePhrases('site_info_title');

useHead({
    htmlAttrs: {
        lang: eruditConfig.language || 'en',
        style: {
            '--brand': eruditConfig.site?.style?.brandColor || undefined,
            '--transitionSpeed': eruditConfig.debug?.slowTransition
                ? '.5s'
                : undefined,
        } as any,
    },
    link: [
        { rel: 'icon', href: faviconHref },
        { rel: 'canonical', href: pageUrl },
    ],
    script: [
        {
            key: 'immediate-js',
            tagPriority: 'critical',
            innerHTML: (await import('@app/scripts/_immediate.js?raw')).default,
        },
    ],
    style: [
        {
            key: 'immediate-css',
            tagPriority: 'critical',
            innerHTML: (await import('$/_immediate.css?raw')).default,
        },
    ],
    meta: [
        {
            name: 'viewport',
            content:
                'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no',
        },
        ...createOgImageTags(siteUrl, defaultOgImage),
    ],
});

useSeoMeta({
    ogUrl: usePageUrl(),
    ogSiteName:
        eruditConfig.seo?.title ||
        eruditConfig.site?.title ||
        phrase.site_info_title,
});

// @ts-ignore
if (!eruditConfig?.repository?.sharedUrl) delete majorPanes.language;

const { activePane } = useMajorPane();

//
// Swtiching major pane to match the new route
//

watch(route, () => {
    if (route.path === '/') return (activePane.value = 'index');

    const pathType = route.path.split('/')[1];
    if (['book', 'group', 'article', 'summary', 'practice'].includes(pathType!))
        return (activePane.value = 'index');

    return (activePane.value = 'pages');
});

if (import.meta.client) {
    //
    // Theme Switch Watcher
    //

    const { theme, binaryTheme } = useTheme();

    watch(theme, (newTheme) => {
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', binaryTheme.value);
    });

    //
    // Welcome
    //

    document.documentElement.before(document.createComment(brandLogotype));
    const emojies = [
        '😂',
        '❤️',
        '🤣',
        '🎉',
        '🔥',
        '💖',
        '👀',
        '✨',
        '💗',
        '💚',
        '💙',
        '🎁',
        '🌈',
    ];
    const emoji = emojies[Math.floor(Math.random() * emojies.length)];

    console.log(
        '%c' +
            brandLogotype +
            '\n%cv' +
            version +
            ' ' +
            emoji +
            ' %cBeating heart of modern educational sites!\n\n%cLearn more: https://github.com/Gwynerva/erudit\n ',
        `color: transparent; background: linear-gradient(to right, ${brandColors[0]}, ${brandColors[1]}); background-clip: text; -webkit-background-clip: text;`,
        'color: inherit;',
        'font-style: italic; color: #888;',
        'color: inherit;',
    );
}
</script>

<template>
    <SiteAside :type="AsideType.Major"><AsideMajor /></SiteAside>
    <SiteAside :type="AsideType.Minor"><AsideMinor /></SiteAside>

    <div :class="$style.mainContainer">
        <div><!-- Phantom aside major --></div>
        <SiteMain><NuxtPage /></SiteMain>
        <div><!-- Phantom aside minor --></div>
    </div>
</template>

<style lang="scss">
@use '$/normalize';
@use '$/app';
</style>

<style lang="scss" module>
@use '$/def/bp';
@use '$/def/z';

.mainContainer {
    --w_asideMajor: 0;
    --w_asideMinor: 0;
    --w_main: minmax(0, 1fr);

    position: relative;
    z-index: z.$main;

    display: grid;
    grid-template-columns: var(--w_asideMajor) var(--w_main) var(--w_asideMinor);

    margin: auto;
    max-width: calc(2 * var(--wAside) + var(--wMainMax));

    @include transition(grid);

    @include bp.above('aside1') {
        --w_asideMajor: var(--wAside);
        --w_asideMinor: 0;
    }

    @include bp.above('aside2') {
        --w_asideMajor: var(--wAside);
        --w_asideMinor: var(--wAside);
    }
}
</style>
