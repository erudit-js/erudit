<script lang="ts" setup>
import type { AsideMinorData } from '@shared/asideMinor';
import { asideMinorKey } from '@app/scripts/aside/minor/state';

import {
    LazyAsideMinorNews,
    LazyAsideMinorTopic,
    LazyAsideMinorContent,
    LazyAsideMinorContributor,
} from '#components';

let setupI = 0;

const route = useRoute();
const nuxtApp = useNuxtApp();

const asideData = shallowRef<AsideMinorData>();
const AsideMinorPane = shallowRef<Component>();

async function setupAsideMinorData() {
    const currentSetupI = ++setupI;
    const path = route.path;
    const payloadKey = 'aside-minor';
    const asideMinorPayload =
        (nuxtApp.static.data[payloadKey] ||=
        nuxtApp.payload.data[payloadKey] ||=
            {});

    const data: AsideMinorData = await (async () => {
        const payloadKeyValue: AsideMinorData | 'news' = (asideMinorPayload[
            path
        ] ||= await $fetch(`/api/aside/minor/path`, { query: { path } }));

        if (payloadKeyValue === 'news') {
            // We do not save news in the payload as it will always have the same content.
            // So we prerender news once and use the same data for all pages.
            nuxtApp.runWithContext(() =>
                prerenderRoutes('/api/aside/minor/news'),
            );
            return await $fetch('/api/aside/minor/news');
        } else return payloadKeyValue;
    })();

    if (currentSetupI !== setupI) return; // This data is outdated because new `setupAsideMinorData` was called.

    asideData.value = data;

    AsideMinorPane.value = (() => {
        switch (asideData.value.type) {
            case 'topic':
                return LazyAsideMinorTopic;
            case 'book':
            case 'group':
                return LazyAsideMinorContent;
        }

        return LazyAsideMinorNews;
    })();
}

watch(route, setupAsideMinorData);
await setupAsideMinorData();

provide(asideMinorKey, asideData);
</script>

<template>
    <TransitionFade>
        <component :is="AsideMinorPane" />
    </TransitionFade>
</template>
