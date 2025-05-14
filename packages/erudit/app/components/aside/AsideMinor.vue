<script lang="ts" setup>
import { isTopicPart } from '@erudit-js/cog/schema';

import { type AsideMinorNews, type AsideMinorData } from '@shared/aside/minor';
import { trailingSlash } from '@erudit/utils/slash';
import { asideMinorKey } from '@app/scripts/aside/minor/state';

import {
    LazyAsideMinorNews,
    LazyAsideMinorTopic,
    LazyAsideMinorContent,
} from '#components';

let setupI = 0;

const route = useRoute();
const nuxtApp = useNuxtApp();

const asideData = shallowRef<AsideMinorData>();
const AsideMinorPane = shallowRef<Component>();

async function setupAsideMinorData() {
    const currentSetupI = ++setupI;
    const path = trailingSlash(route.path, false).substring(1);
    const pathParts = path.split('/');

    const payloadKey = 'aside-minor';
    const asideMinorPayload =
        (nuxtApp.static.data[payloadKey] ||=
        nuxtApp.payload.data[payloadKey] ||=
            {});

    const data: AsideMinorData = await (async () => {
        const firstPathPart = pathParts[0];

        if (isTopicPart(firstPathPart)) {
            return (asideMinorPayload[path] ||= await $fetch(
                `/api/aside/minor/topic`,
                {
                    query: {
                        topicPart: firstPathPart,
                        topicId: pathParts.slice(1).join('/'),
                    },
                },
            ));
        }

        switch (firstPathPart) {
            case 'book':
            case 'group':
                return (asideMinorPayload[path] ||= await $fetch(
                    `/api/aside/minor/${pathParts.join('/')}`,
                ));
            default:
                prerenderRoutes(['/api/aside/minor/news']);
                return await $fetch<AsideMinorNews>(`/api/aside/minor/news`);
        }
    })();

    if (currentSetupI !== setupI) {
        // This data is outdated because new `setupAsideMinorData` was called
        return;
    }

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
