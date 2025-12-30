<script lang="ts" setup>
import type { AnySchema, GenericStorage, ProseElement } from '@jsprose/core';
import { Prose, type ProseContext } from '@erudit-js/prose/app';

import { EruditLink, MaybeMyIcon, TransitionFade } from '#components';

const { element, storage, useHashUrl } = defineProps<{
    element: ProseElement<AnySchema>;
    storage: GenericStorage;
    useHashUrl: boolean;
}>();

const route = useRoute();

const hashUrl = computed(() => {
    return useHashUrl
        ? route.hash
            ? route.hash.slice(1)
            : undefined
        : undefined;
});

const { setPreview, closePreview } = usePreview();

const context: ProseContext = {
    appElements,
    mode: ERUDIT.config.mode,
    languageCode: ERUDIT.config.project.language.current,
    formatText,
    pathUrl: route.path,
    baseUrl: ERUDIT.config.project.baseUrl,
    hashUrl,
    eruditIcons: ICONS,
    EruditIcon: MaybeMyIcon,
    EruditTransition: TransitionFade,
    EruditLink,
    setPreview,
    closePreview,
    loadingSvg,
};
</script>

<template>
    <Prose
        :element
        :storage
        :context
        class="px-[calc(var(--proseGap)-var(--proseAsideWidth))] py-(--_pMainY)
            [--proseGap:var(--_pMainX)]"
    />
</template>
