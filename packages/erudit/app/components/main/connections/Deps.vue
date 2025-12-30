<script setup lang="ts">
import ScrollPane from './ScrollPane.vue';

defineProps<{ deps: ContentDep[] }>();

const formatText = await useFormatText();
</script>

<template>
    <ScrollPane>
        <div v-for="dep of deps" class="gap-small flex">
            <MyIcon
                :name="ICONS[dep.contentType]"
                class="relative top-1 shrink-0"
            />
            <div class="flex flex-col gap-1">
                <div>
                    <EruditLink
                        :to="dep.link"
                        class="gap-small text-hover-underline inline-flex
                            items-center"
                    >
                        <span>{{ formatText(dep.title) }}</span>
                        <MyIcon
                            name="arrow/outward"
                            class="text-text-disabled relative -top-1 shrink-0
                                text-[8px]"
                        />
                    </EruditLink>
                </div>
                <div
                    v-if="dep.type === 'hard'"
                    class="text-text-muted text-main-sm italic"
                >
                    {{ formatText(dep.reason) }}
                </div>
            </div>
        </div>
    </ScrollPane>
</template>
