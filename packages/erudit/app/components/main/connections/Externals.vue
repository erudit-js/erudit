<script setup lang="ts">
import type { ContentExternal } from '@erudit-js/core/content/externals';
import ScrollPane from './ScrollPane.vue';

defineProps<{ externals: ContentExternal[] }>();
</script>

<template>
    <ScrollPane>
        <div v-for="external of externals" class="gap-small flex">
            <MyIcon
                :name="external.type === 'physical' ? 'book' : 'globe'"
                class="relative top-1 shrink-0"
            />
            <div class="flex flex-col gap-0.5">
                <div>
                    <template v-if="external.type === 'web'">
                        <EruditLink
                            external
                            target="_blank"
                            :to="external.link"
                            :class="[external.link && 'text-hover-underline']"
                        >
                            {{ formatText(external.title) }}
                            <MyIcon
                                v-if="external.link"
                                name="arrow/outward"
                                class="text-text-disabled text-main-sm relative
                                    -top-1 inline"
                            />
                        </EruditLink>
                    </template>
                    <template v-else>
                        <span>{{ formatText(external.title) }}</span>
                    </template>
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
