<script lang="ts" setup>
import { ref } from 'vue';

import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';
import { useFormatText } from '../../../app';
import { useIcon } from '../../../app/front/composables/icon';
import plusIcon from '../../../app/front/assets/plus.svg?raw';
import Expander from '../../../shared/Expander.vue';
import Render from '../../../app/front/components/Render.vue';

defineProps<{
    title: string;
    element: ParsedElement<ElementSchemaAny>;
}>();

const formatText = useFormatText();
const Icon = useIcon();
const opened = ref(false);
</script>

<template>
    <div
        @click="opened = !opened"
        class="group border-border text-text-muted relative flex cursor-pointer
            items-center border-t p-(--proseAsideWidth) font-semibold
            transition-[border] first:border-t-0"
    >
        <div class="flex-1">{{ formatText(title) }}</div>
        <button
            class="group-hocus:bg-border/80 text-text-muted shrink-0 rounded
                bg-transparent p-[5px] transition-[background]"
        >
            <Icon
                :name="plusIcon"
                :class="['transition-[rotate]', opened ? 'rotate-45' : '']"
            />
        </button>
    </div>
    <Expander>
        <div
            v-if="opened"
            class="border-border border-t border-dashed py-(--proseAsideWidth)
                transition-[border]"
        >
            <Render v-for="child of element.children" :element="child" />
        </div>
    </Expander>
</template>
