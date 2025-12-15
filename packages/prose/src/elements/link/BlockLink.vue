<script lang="ts" setup>
import { shallowRef } from 'vue';
import { ProseError, type ProseElement } from '@jsprose/core';

import type { blockLinkSchema } from './core.js';
import { useProseContext } from '../../app/composables/context.js';
import { useElementStorage } from '../../app/composables/storage.js';
import { useFormatText } from '../../app/composables/formatText.js';
import { useElementPhrase } from '../../app/composables/language.js';
import { useElementIcon } from '../../app/composables/elementIcon.js';
import Block from '../../app/shared/block/Block.vue';

const { element } = defineProps<{
    element: ProseElement<typeof blockLinkSchema>;
}>();

const { EruditLink, EruditIcon, eruditIcons } = useProseContext();
const linkStorage = await useElementStorage(element);
const formatText = useFormatText();

interface UIData {
    icon: string;
    text: string;
    secondary?: {
        icon: string;
        text: string;
    };
}

const uiData = shallowRef<UIData>();

switch (linkStorage.type) {
    case 'unique':
        const elementPhrase = await useElementPhrase(linkStorage.schemaName);
        uiData.value = {
            icon: await useElementIcon(linkStorage.schemaName),
            text: linkStorage.elementTitle || elementPhrase.element_name,
            secondary: {
                icon: eruditIcons[
                    linkStorage.content.contentType === 'topic'
                        ? linkStorage.content.topicPart
                        : linkStorage.content.contentType
                ],
                text: linkStorage.content.contentTitle,
            },
        };
        break;
    case 'contentItem':
        uiData.value = {
            icon: eruditIcons[
                linkStorage.content.contentType === 'topic'
                    ? linkStorage.content.topicPart
                    : linkStorage.content.contentType
            ],
            text: linkStorage.content.contentTitle,
        };
        break;
    default:
        throw new ProseError(
            'BlockLink supports only Unique and Document link types!',
        );
}
</script>

<template>
    <Block :element>
        <EruditLink
            target="_blank"
            :to="linkStorage.resolvedHref"
            class="group bg-brand/5 border-brand/20 hocus:bg-brand/10
                hocus:border-brand/40 relative block rounded-xl border-2
                border-dashed p-(--proseAsideWidth)
                transition-[border,background]"
        >
            <EruditIcon
                name="arrow/outward"
                class="text-brand/15 group-hocus:text-brand/20 top-small
                    right-small absolute shrink-0 text-[30px]
                    transition-[color]"
            />
            <div
                class="text-brand/80 group-hocus:text-brand mb-small gap-small
                    font-medium transition-[color]"
            >
                <EruditIcon
                    :name="uiData!.icon"
                    class="text-main-sm mr-small relative top-0.5 inline
                        align-baseline"
                />
                <span>{{ formatText(uiData!.text) }}</span>
            </div>
            <div class="text-text-muted">
                {{ formatText(element.data.label) }}
            </div>
            <div
                v-if="uiData!.secondary"
                class="text-text-dimmed mt-small text-main-xs"
            >
                <EruditIcon
                    :name="uiData!.secondary!.icon"
                    class="mr-small relative top-0.5 inline align-baseline"
                />
                <span>{{ formatText(uiData!.secondary!.text) }}</span>
            </div>
        </EruditLink>
    </Block>
</template>
