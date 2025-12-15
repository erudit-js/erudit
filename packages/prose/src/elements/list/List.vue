<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import { listSchema } from './core.js';
import Render from '../../app/shared/Render.vue';
import Block from '../../app/shared/block/Block.vue';

defineProps<{ element: ProseElement<typeof listSchema> }>();
</script>

<template>
    <Block :element>
        <component
            :is="element.data.type"
            class="micro:[--proseGap:18px]"
            :style="{
                '--liBorder': 'var(--accentBorder, var(--color-border))',
                '--liBackground':
                    'color-mix(in hsl, var(--accentText, var(--color-text)) 12%, transparent)',
                '--liText': 'var(--accentText, var(--color-text-muted))',
            }"
            v-bind="
                element.data.type === 'ol'
                    ? { start: element.data.start ?? 1 }
                    : {}
            "
        >
            <li
                v-for="(listItem, i) of element.children"
                class="flex not-last-of-type:mb-(--proseGap)"
            >
                <div class="shrink-0">
                    <div
                        class="micro:top-[1.5px] relative flex size-[23px]
                            items-center justify-center rounded-full border
                            border-(--liBorder) bg-(--liBackground)
                            font-semibold text-(--liText)
                            transition-[border,background,color]"
                    >
                        <template v-if="element.data.type === 'ol'">
                            <div class="text-[13px]">
                                {{ i + (element.data.start ?? 0) }}
                            </div>
                        </template>
                        <template v-else>
                            <div
                                class="size-1.5 rounded-full bg-(--liText)
                                    transition-[background]"
                            ></div>
                        </template>
                    </div>
                </div>
                <div class="flex-1">
                    <Render
                        v-for="liItem of listItem.children"
                        :element="liItem"
                    />
                </div>
            </li>
        </component>
    </Block>
</template>
