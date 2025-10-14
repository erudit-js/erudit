<script lang="ts" setup>
import type { DetailsSchema } from '.';
import {
    useContainsAnchor,
    useElementIcon,
    useFormatText,
    useIsAnchor,
    useProseAppContext,
} from '../../app';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Render from '../../app/front/components/Render.vue';
import { useElementPhrase } from '../../app/front/composables/elementPhrase';
import { useIcon } from '../../app/front/composables/icon';
import type { ParsedElement } from '../../element';

const { element } = defineProps<{ element: ParsedElement<DetailsSchema> }>();
const formatText = useFormatText();
const Icon = useIcon();
const icon = await useElementIcon(element);
const phrase = await useElementPhrase(element);

const { mode } = useProseAppContext();
const isAnchor = useIsAnchor(element);
const containsAnchor = useContainsAnchor(element);
</script>

<template>
    <ProseBlock
        :element
        v-if="isAnchor || containsAnchor || mode !== 'generate'"
    >
        <div
            class="border-border bg-bg-accent/30 rounded-xl border-2
                border-dashed transition-[border,background]"
        >
            <div class="text-text-muted p-(--proseAsideWidth) font-medium">
                <Icon
                    :name="icon"
                    class="text-main-sm mr-small relative top-[2px] inline
                        align-baseline"
                />
                <span>
                    {{ formatText(element.data || phrase.element_name) }}
                </span>
            </div>
            <div class="pb-(--proseAsideWidth)">
                <Render v-for="child in element.children" :element="child" />
            </div>
        </div>
    </ProseBlock>
</template>
