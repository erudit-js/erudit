<script lang="ts" setup>
import { inject } from 'vue';

import {
    LinkType,
    type LinkSchema,
    type LinkStorageDocument,
    type LinkStorageUnique,
} from '.';
import type { ParsedElement } from '../../element';
import { useIcon } from '../../app/front/composables/icon';
import { proseContextSymbol, useFormatText } from '../../app';
import { useElementStorage } from '../../app/front/composables/elementStorage';

// Using things from Nuxt App Erudit
import * as EruditPreview from '../../../../erudit/shared/types/preview';

const { element } = defineProps<{ element: ParsedElement<LinkSchema> }>();

const Icon = useIcon();
const formatText = useFormatText();
const { usePreview, appElements, icons, EruditLink } =
    inject(proseContextSymbol)!;
const { closePreview, setPreview } = usePreview();

const linkStorage = await useElementStorage<LinkSchema>(element);

const { icon, href } = await (async () => {
    switch (element.data.type) {
        case LinkType.Direct:
            return { icon: 'link', href: element.data.href };
        case LinkType.Unique:
            const uniqueStorage = linkStorage as LinkStorageUnique;
            const appElement = appElements[uniqueStorage.elementName];
            return {
                icon: await appElement.icon(),
                href: uniqueStorage.href,
            };
        case LinkType.Document:
            const documentStorage = linkStorage as LinkStorageDocument;
            return {
                icon: icons[documentStorage.typeOrPart],
                href: documentStorage.href,
            };
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
        window.open(href, '_blank');
        return false;
    }

    switch (element.data.type) {
        case LinkType.Direct:
            setPreview({
                type: EruditPreview.PreviewType.DirectLink,
                href,
            } as EruditPreview.PreviewRequestDirectLink);
            break;
        case LinkType.Unique:
            const uniqueStorage = linkStorage as LinkStorageUnique;
            setPreview({
                type: EruditPreview.PreviewType.Unique,
                contentPathUniqueSlug:
                    uniqueStorage.documentTypeOrPart +
                    '/' +
                    uniqueStorage.contentFullId +
                    '/' +
                    uniqueStorage.uniqueSlug,
            } as EruditPreview.PreviewRequestUnique);
            break;
        case LinkType.Document:
            const documentStorage = linkStorage as LinkStorageDocument;
            setPreview({
                type: EruditPreview.PreviewType.ContentPage,
                typeOrPart: documentStorage.typeOrPart,
                fullId: documentStorage.contentFullId,
            } as EruditPreview.PreviewRequestContentPage);
            break;
    }

    doubleClick.startTimeout();
    return false;
}
</script>

<template>
    <EruditLink
        @click.capture.prevent="linkClick"
        :to="href"
        :external="element.data.type === LinkType.Direct"
        :style="{ '--tGap': '1px', '--xGap': '4px', '--bGap': '4px' }"
        class="text-brand hocus:bg-brand/15 relative -mx-(--xGap) -mt-(--tGap)
            -mb-(--bGap) rounded-sm bg-transparent px-(--xGap) pt-(--tGap)
            pb-(--bGap) underline
            [text-decoration-color:color-mix(in_srgb,var(--color-brand)30%,transparent)]
            [text-decoration-thickness:2px] underline-offset-2
            transition-[color,background]"
    >
        <Icon
            :name="icon"
            class="micro:pr-[6px] micro:text-lg inline pr-[4px] text-sm"
        />
        <span>{{ formatText(element.data.text) }}</span>
    </EruditLink>
</template>
