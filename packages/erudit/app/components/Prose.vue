<script lang="ts" setup>
import type {
    ElementSchemaAny,
    GenericStorage,
    ParsedElement,
} from '@erudit-js/prose';
import { Prose, type ProseAppContext } from '@erudit-js/prose/app';

import { MaybeMyIcon, TransitionFade, EruditLink } from '#components';

const { element, storage, urlPath, useHash } = defineProps<{
    element: ParsedElement<ElementSchemaAny>;
    storage: GenericStorage;
    urlPath: string;
    useHash: boolean;
}>();

const route = useRoute();

const hashId = computed(() => {
    return useHash ? (route.hash ? route.hash.slice(1) : undefined) : undefined;
});

const context: ProseAppContext = {
    mode: ERUDIT.config.mode,
    sitePath: withBaseUrl(urlPath),
    siteBaseUrl: ERUDIT.config.project.baseUrl,
    languageCode: ERUDIT.config.project.language.current,
    storage,
    appElements,
    loadingSvg,
    hashId,
    formatText: await useFormatText(),
    MaybeMyIcon,
    TransitionFade,
    usePreview,
    icons: ICONS,
    EruditLink,
};
</script>

<template>
    <Prose
        :element
        :context
        :style="{ '--proseGap': 'var(--_pMainX)' }"
        class="px-[calc(var(--proseGap)-var(--proseAsideWidth))] py-(--_pMainY)"
    />
</template>
