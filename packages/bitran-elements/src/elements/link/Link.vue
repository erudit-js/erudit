<script lang="ts" setup>
import { h, toRaw } from 'vue';
import {
    useElementParseData,
    useElementRenderData,
    type ElementProps,
} from '@bitran-js/renderer-vue';
import { isContentType, isTopicPart } from '@erudit-js/cog/schema';

import { useBaseUrlPath, useBitranElementIcon, useFormatText } from '#imports';

import { CONTENT_TYPE_ICON, ICON, TOPIC_PART_ICON } from '@erudit/shared/icons';
import type { LinkSchema } from './shared';
import { MyIcon, MyRuntimeIcon } from '#components';
import { showPreview, togglePreview } from '@erudit/app/scripts/preview/state';
import { PreviewRequestType } from '@erudit/app/scripts/preview/request';

const { node } = defineProps<ElementProps<LinkSchema>>();
const { label } = useElementParseData<LinkSchema>();
const linkTarget = useElementRenderData<LinkSchema>();

const baseUrlPath = useBaseUrlPath();
const formatText = useFormatText();

const Icon = await (async () => {
    const type = linkTarget.type;

    if (type === 'unique') {
        return h(MyRuntimeIcon, {
            name: 'link-icon',
            svg: await useBitranElementIcon(linkTarget._productName!),
        });
    } else if (type === 'absolute') {
        return h(MyIcon, { name: 'link' });
    } else if (type === 'external') {
        return h(MyIcon, { name: 'link-external' });
    } else if (type === 'page') {
        const pageType = linkTarget.pageType;

        if (isTopicPart(pageType))
            return h(MyIcon, { name: TOPIC_PART_ICON[pageType] });
        if (isContentType(pageType))
            return h(MyIcon, { name: CONTENT_TYPE_ICON[pageType] });

        switch (pageType) {
            case 'contributor':
                return h(MyIcon, { name: ICON.contributor });
        }

        return h(MyIcon, { name: 'link' });
    }
})();

const href = (() => {
    switch (linkTarget.type) {
        case 'absolute':
        case 'external':
            return linkTarget.href;
        case 'page':
        case 'unique':
            return linkTarget._href!;
    }
})();

const doubleClick = {
    timeout: null as any,
    startTimeout() {
        this.timeout = setTimeout(() => {
            this.reset();
        }, 400);
    },
    reset() {
        clearTimeout(this.timeout);
        this.timeout = null;
    },
};

function linkClick(e: Event) {
    // Direct link traversal is disabled, use double click instead!
    e.stopPropagation();
    e.preventDefault();

    if (doubleClick.timeout) {
        doubleClick.reset();
        togglePreview(false);
        window.open(baseUrlPath(href), '_blank');
        return false;
    }

    showPreview({
        type: PreviewRequestType.Link,
        linkData: toRaw(node.parseData),
        linkTarget: toRaw(linkTarget),
    });

    doubleClick.startTimeout();

    return false;
}
</script>

<template>
    <a
        :href="baseUrlPath(href)"
        :class="$style.link"
        @click="linkClick"
        :external="true"
    >
        <Icon :class="$style.icon" wrapper="span" />
        <span :class="$style.label">{{ formatText(label) }}</span>
    </a>
</template>

<style lang="scss" module>
.link {
    --linkColor: var(--brand);

    padding: 0 3px;

    color: var(--linkColor);
    text-decoration-thickness: 2px;
    text-decoration-style: solid;
    text-decoration-color: color-mix(
        in srgb,
        var(--linkColor),
        transparent 75%
    );

    border-radius: 5px;

    @include transition(background);

    &:hover,
    &:active {
        background: color-mix(in srgb, var(--linkColor), transparent 87.5%);
    }

    .icon {
        position: relative;
        top: 1.75px;
        font-size: 0.86em;
        padding-right: 3.5px;
        text-decoration: none;
        color: color-mix(in srgb, var(--linkColor), transparent 10%);

        svg {
            display: inline;
        }
    }

    .label {
        font-weight: 450;
    }
}
</style>
