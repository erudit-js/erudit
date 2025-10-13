<script lang="ts" setup>
import type { BlockLinkSchema } from '.';
import { useFormatText, useProseAppContext } from '../../app';
import type { ParsedElement } from '../../element';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import { useElementStorage } from '../../app/front/composables/elementStorage';
import { useIcon } from '../../app/front/composables/icon';
import {
    LinkType,
    type LinkStorageDocument,
    type LinkStorageUnique,
} from '../link';
import { ProseError } from '../../error';

const { element } = defineProps<{ element: ParsedElement<BlockLinkSchema> }>();
const formatText = useFormatText();
const Icon = useIcon();
const { EruditLink, appElements, languageCode, icons } = useProseAppContext();
const linkStorage = await useElementStorage<BlockLinkSchema>(element);

interface UIData {
    icon: string;
    text: string;
    secondary?: {
        icon: string;
        text: string;
    };
}

const uiData: UIData = await (async () => {
    switch (element.data.type) {
        case LinkType.Unique:
            const uniqueStorage = linkStorage as LinkStorageUnique;
            const appElement = appElements[uniqueStorage.elementName];
            const elementPhrase = await appElement.languages[languageCode]();
            return {
                icon: await appElement.icon(),
                text: uniqueStorage.elementTitle || elementPhrase.element_name,
                secondary: {
                    icon: icons[uniqueStorage.documentTypeOrPart],
                    text: uniqueStorage.documentTitle,
                },
            };
        case LinkType.Document:
            const documentStorage = linkStorage as LinkStorageDocument;
            return {
                icon: icons[documentStorage.typeOrPart],
                text: documentStorage.title,
            };
        default:
            throw new ProseError(
                'BlockLink supports only Unique and Document link types.',
            );
    }
})();
</script>

<template>
    <ProseBlock :element>
        <EruditLink
            target="_blank"
            :to="linkStorage!.href"
            class="group bg-brand/5 border-brand/20 hocus:bg-brand/10
                hocus:border-brand/40 relative block rounded-xl border-2
                border-dashed p-(--proseAsideWidth)
                transition-[border,background]"
        >
            <Icon
                name="arrow/outward"
                class="text-brand/15 group-hocus:text-brand/20 top-small
                    right-small absolute shrink-0 text-[30px]
                    transition-[color]"
            />
            <div
                class="text-brand/80 group-hocus:text-brand mb-small gap-small
                    font-medium transition-[color]"
            >
                <Icon
                    :name="uiData.icon"
                    class="text-main-sm mr-small relative top-[2px] inline
                        align-baseline"
                />
                <span>{{ formatText(uiData.text) }}</span>
            </div>
            <div class="text-text-muted">
                {{ formatText(element.data.text) }}
            </div>
            <div
                v-if="uiData.secondary"
                class="text-text-dimmed mt-small text-main-xs"
            >
                <Icon
                    :name="uiData.secondary.icon"
                    class="mr-small relative top-[2px] inline align-baseline"
                />
                <span>{{ formatText(uiData.secondary.text) }}</span>
            </div>
        </EruditLink>
    </ProseBlock>
</template>
