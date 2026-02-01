<script lang="ts" setup>
import type { AnySchema, GenericStorage, ProseElement } from '@jsprose/core';
import type { EruditMode } from '@erudit-js/core/mode';
import { Prose, type ProseContext } from '@erudit-js/prose/app';

import { EruditLink, MaybeMyIcon, TransitionFade } from '#components';

const { element, storage, useHashUrl } = defineProps<{
    element: ProseElement<AnySchema>;
    storage: GenericStorage;
    useHashUrl: boolean;
}>();

const runtimeConfig = useRuntimeConfig();

const loadingSvg = useLoadingSvg();
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
    mode: runtimeConfig.public.eruditMode as EruditMode,
    languageCode: ERUDIT.config.language.current,
    formatText,
    pathUrl: route.path,
    baseUrl: runtimeConfig.app.baseURL,
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
        :style="{ '--proseGap': 'calc(var(--spacing-main)*1.1)' }"
        class="py-main px-[calc(var(--proseGap)-var(--proseAsideWidth))]"
    />
</template>
