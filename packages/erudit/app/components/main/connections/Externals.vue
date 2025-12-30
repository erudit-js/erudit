<script setup lang="ts">
import type { ContentExternal } from '@erudit-js/core/content/externals';
import ScrollPane from './ScrollPane.vue';

defineProps<{ externals: ContentExternal[] }>();

const formatText = await useFormatText();
</script>

<template>
    <ScrollPane>
        <div v-for="external of externals" class="gap-small flex">
            <MyIcon
                :name="external.type === 'physical' ? 'book' : 'globe'"
                class="relative top-1 shrink-0"
            />
            <div class="flex flex-col gap-1">
                <div>
                    <EruditLink
                        external
                        target="_blank"
                        :to="external.link"
                        :class="[
                            'gap-small inline-flex items-center',
                            external.link && 'text-hover-underline',
                        ]"
                    >
                        <span>{{ formatText(external.title) }}</span>
                        <MyIcon
                            v-if="external.link"
                            name="arrow/outward"
                            class="text-text-disabled relative -top-1 shrink-0
                                text-[8px]"
                        />
                    </EruditLink>
                </div>
                <div v-if="external.info" class="text-text-muted text-main-sm">
                    {{ formatText(external.info) }}
                </div>
                <div class="text-text-muted text-main-sm italic">
                    {{ formatText(external.reason) }}
                </div>
            </div>
        </div>
    </ScrollPane>
</template>
