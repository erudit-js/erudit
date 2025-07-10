<script lang="ts" setup>
import {
    isContentType,
    isTopicPart,
    type BitranLocationType,
} from '@erudit-js/cog/schema';

import {
    injectFormatText,
    useElementParseData,
    useElementRenderData,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import type { MyIconName } from '#my-icons';

import { CONTENT_TYPE_ICON, ICON, TOPIC_PART_ICON } from '@shared/icons';

import { type BlockLinkSchema } from './shared';
import { useBitranElementIcon } from '#imports';

const { node } = defineProps<ElementProps<BlockLinkSchema>>();
const parseData = useElementParseData<BlockLinkSchema>();
const renderData = useElementRenderData<BlockLinkSchema>();

const pretty = injectFormatText();

function getTypeIcon(type: BitranLocationType): MyIconName {
    if (isTopicPart(type)) {
        return TOPIC_PART_ICON[type];
    }

    if (isContentType(type)) {
        return CONTENT_TYPE_ICON[type];
    }

    switch (type) {
        case 'contributor':
            return ICON.contributor;
    }
}

const elementIcon = await (async () => {
    if (renderData.type === 'unique') {
        return await useBitranElementIcon(renderData.elementName);
    }
})();

const description = parseData.label?.trim() || renderData.locationDescription;
</script>

<template>
    <EruditLink
        :to="renderData.link"
        :prefetch="false"
        :class="$style.blockLink"
    >
        <div :class="$style.header">
            <MyIcon
                v-if="renderData.type === 'location'"
                :name="getTypeIcon(renderData.locationType)"
                :class="$style.typeIcon"
            />
            <MyRuntimeIcon
                v-else-if="renderData.type === 'unique'"
                :name="'block-link-icon'"
                :svg="elementIcon!"
                :class="$style.typeIcon"
            />
            <div :class="$style.title">{{ pretty(renderData.title) }}</div>
            <MyIcon name="arrow-left" :class="$style.gotoArrow" />
        </div>
        <div v-if="description">
            {{ pretty(description) }}
        </div>
        <div
            v-if="renderData.type === 'unique' && renderData.locationTitle"
            :class="$style.footer"
        >
            <MyIcon :name="getTypeIcon(renderData.locationType)" />
            {{ pretty(renderData.locationTitle) }}
        </div>
    </EruditLink>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;
@use '@bitran-js/renderer-vue/scss/bp' as bitranBp;

.blockLink {
    display: flex;
    flex-direction: column;
    gap: var(--bitran_gap);
    padding: var(--bitran_gap);
    border-radius: 5px;
    border: 1px solid var(--bitran_colorBorder);
    background: light-dark(#f7f7f7, #282828);
    text-decoration: none;
    color: inherit;

    .header {
        display: flex;
        align-items: center;
        gap: var(--bitran_gap);

        @include bitranBp.below('mobile') {
            gap: var(--bitran_gapSmall);
        }

        .title {
            font-size: 1.1em;
            font-weight: bold;
            line-height: 1;
        }

        .typeIcon {
            flex-shrink: 0;
            color: var(--bitran_textMuted);
        }

        .gotoArrow {
            flex-shrink: 0;
            color: var(--bitran_textDimmed);
            transform: scaleX(-1);
            opacity: 0.8;
            @include bitranUtils.transition(color, opacity);
        }
    }

    &:hover {
        .gotoArrow {
            color: var(--text);
            opacity: 1;
        }
    }

    .footer {
        display: flex;
        gap: var(--bitran_gapSmall);
        align-items: center;
        line-height: 1;
        font-weight: 500;
        font-size: 0.9em;
        color: var(--bitran_textDimmed);
    }
}
</style>
