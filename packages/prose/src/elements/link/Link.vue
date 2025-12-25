<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import type { linkSchema } from './core.js';
import { useProseContext } from '../../app/composables/context.js';
import { useFormatText } from '../../app/composables/formatText.js';
import { useElementStorage } from '../../app/composables/storage.js';
import { useElementIcon } from '../../app/composables/elementIcon.js';
import Inliner from '../../app/shared/inliner/Inliner.vue';

const { element } = defineProps<{
    element: ProseElement<typeof linkSchema>;
}>();

const {
    EruditIcon,
    EruditLink,
    eruditIcons,
    setPreview,
    closePreview,
    baseUrl,
} = useProseContext();
const formatText = useFormatText();
const linkStorage = await useElementStorage(element);

const icon = await (async () => {
    switch (linkStorage.type) {
        case 'direct':
            return 'link';
        case 'contentItem':
            return eruditIcons[
                linkStorage.content.contentType === 'topic'
                    ? linkStorage.content.topicPart
                    : linkStorage.content.contentType
            ];
        case 'unique':
            return await useElementIcon(linkStorage.schemaName);
    }
})();

const doubleClick = {
    timeout: undefined as ReturnType<typeof setTimeout> | undefined,
    startTimeout() {
        this.timeout = setTimeout(() => {
            this.reset();
        }, 400);
    },
    reset() {
        clearTimeout(this.timeout);
        this.timeout = undefined;
    },
};

function linkClick() {
    if (doubleClick.timeout) {
        doubleClick.reset();
        closePreview();
        const openUrl =
            linkStorage.type === 'direct'
                ? linkStorage.resolvedHref
                : baseUrl + linkStorage.resolvedHref.slice(1);
        window.open(openUrl, '_blank');
        return false;
    }

    setPreview(linkStorage.previewRequest);
    doubleClick.startTimeout();
    return false;
}
</script>

<template>
    <Inliner :element>
        <EruditLink
            @click.capture.prevent="linkClick"
            :to="linkStorage.resolvedHref"
            :style="{ '--tGap': '1px', '--xGap': '4px', '--bGap': '4px' }"
            class="text-brand hocus:bg-brand/15 relative
                -mx-[calc(var(--xGap)-3px)] -mt-(--tGap) -mb-(--bGap) rounded-sm
                bg-transparent px-(--xGap) pt-(--tGap) pb-(--bGap) underline
                decoration-[color-mix(in_srgb,var(--color-brand)30%,transparent)]
                decoration-2 underline-offset-2 transition-[color,background]"
        >
            <EruditIcon
                :name="icon"
                class="micro:pr-1.5 micro:text-lg inline pr-1 text-sm"
            />
            <span>{{ formatText(element.data.label) }}</span>
        </EruditLink>
    </Inliner>
</template>
