<script setup lang="ts">
import { ContentType } from '@erudit-js/cog/schema';
import { Prose, type ProseAppContext } from '@erudit-js/prose/app';

import { MaybeMyIcon, TransitionFade } from '#components';

const route = useRoute();
const pageId = Array.isArray(route.params.pageId)
    ? route.params.pageId.join('/')
    : route.params.pageId!;
const contentPath = createContentPath(ContentType.Page, pageId);
const mainContent = await useMainContent<MainContentPage>(contentPath);
const formatText = await useFormatText();

const hashId = computed(() => {
    return route.hash ? route.hash.slice(1) : undefined;
});

const context: ProseAppContext = {
    storage: mainContent.storage,
    appElements,
    loadingSvg,
    hashId,
    formatText,
    MaybeMyIcon,
    TransitionFade,
};
</script>

<template>
    <h1>Page {{ pageId }}</h1>
    <EruditLink to="/page/sub-group/sub-page/#paragraph-i6rgnx2vw8D3">
        Go to Anchor
    </EruditLink>
    <div>
        {{ mainContent.breadcrumbs }}
    </div>
    <Prose
        :element="mainContent.element"
        :context
        :style="{ '--proseGap': 'var(--_pMainX)' }"
        class="px-[calc(var(--proseGap)-var(--proseAsideWidth))] py-(--_pMainY)"
    />
</template>
