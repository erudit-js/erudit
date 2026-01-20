<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import type { detailsSchema } from './core.js';
import { useFormatText } from '../../app/composables/formatText.js';
import { useProseContext } from '../../app/composables/context.js';
import {
    useIsAnchor,
    useContainsAnchor,
} from '../../app/composables/anchor.js';
import { useElementIcon } from '../../app/composables/elementIcon.js';
import { useElementPhrase } from '../../app/composables/language.js';
import Block from '../../app/shared/block/Block.vue';
import Render from '../../app/shared/Render.vue';

const { element } = defineProps<{
    element: ProseElement<typeof detailsSchema>;
}>();

const { EruditIcon } = useProseContext();
const formatText = useFormatText();
const icon = await useElementIcon(element);
const phrase = await useElementPhrase(element);
const { mode } = useProseContext();
const isAnchor = useIsAnchor(element);
const containsAnchor = useContainsAnchor(element);
</script>

<template>
    <Block :element v-if="isAnchor || containsAnchor || mode !== 'static'">
        <div
            class="border-border bg-bg-accent/30 rounded-xl border-2
                border-dashed dark:border-white/30 dark:bg-white/5"
        >
            <div class="text-text-muted p-(--proseAsideWidth) font-medium">
                <EruditIcon
                    :name="icon"
                    class="text-main-sm mr-small relative top-0.5 inline
                        align-baseline"
                />
                <span>
                    {{ formatText(element.data.title || phrase.element_name) }}
                </span>
            </div>
            <div class="pb-(--proseAsideWidth)">
                <Render v-for="child in element.children" :element="child" />
            </div>
        </div>
    </Block>
</template>
