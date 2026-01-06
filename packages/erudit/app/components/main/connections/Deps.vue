<script setup lang="ts">
import ScrollPane from './ScrollPane.vue';

defineProps<{ deps: ContentDep[] }>();
</script>

<template>
    <ScrollPane>
        <div v-for="dep of deps" class="gap-small flex">
            <MyIcon
                :name="ICONS[dep.contentType]"
                class="relative top-1 shrink-0"
            />
            <div class="flex flex-col gap-0.5">
                <div>
                    <EruditLink :to="dep.link" class="text-hover-underline">
                        {{ formatText(dep.title) }}
                        <MyIcon
                            name="arrow/outward"
                            class="text-text-disabled text-main-sm relative
                                -top-1 inline"
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
