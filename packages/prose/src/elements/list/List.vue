<script lang="ts" setup>
import type { ParsedElement } from '../../element';
import type { ListSchema } from './schema';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Render from '../../app/front/components/Render.vue';

defineProps<{ element: ParsedElement<ListSchema> }>();
</script>

<template>
    <ProseBlock :element>
        <component
            :is="element.data.type === 'ordered' ? 'ol' : 'ul'"
            class="micro:[--proseGap:18px]"
            :style="{
                '--liBorder': 'var(--accentBorder, var(--color-border))',
                '--liBackground':
                    'color-mix(in hsl, var(--accentText, var(--color-text)) 12%, transparent)',
                '--liText': 'var(--accentText, var(--color-text-muted))',
            }"
            v-bind="
                element.data.type === 'ordered'
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
                        <template v-if="element.data.type === 'ordered'">
                            <div class="text-[13px]">
                                {{ i + (element.data.start ?? 0) + 1 }}
                            </div>
                        </template>
                        <template v-else>
                            <div
                                class="size-[6px] rounded-full bg-(--liText)
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
    </ProseBlock>
</template>
