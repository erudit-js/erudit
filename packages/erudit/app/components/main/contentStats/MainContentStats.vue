<script lang="ts" setup>
import ItemElement from './ItemElement.vue';
import ItemMaterials from './ItemMaterials.vue';

defineProps<{
    mode: 'single' | 'children';
    stats?: ContentStats;
}>();

const phrase = await usePhrases('stats');
</script>

<template>
    <template v-if="stats">
        <section v-if="mode === 'single'" class="px-main py-main-half">
            <MainSubTitle :title="phrase.stats + ':'" />
            <div
                class="micro:justify-start gap-small micro:gap-normal flex
                    flex-wrap justify-center"
            >
                <ItemMaterials
                    v-if="stats.materials"
                    :count="stats.materials"
                    mode="detailed"
                />
                <ItemElement
                    v-if="stats.elements"
                    v-for="(count, schemaName) of stats.elements"
                    :schemaName
                    :count
                    mode="detailed"
                />
            </div>
        </section>
        <div
            v-else
            class="gap-small micro:gap-normal text-main-sm flex flex-wrap"
        >
            <ItemMaterials
                v-if="stats.materials"
                :count="stats.materials"
                mode="compact"
            />
            <ItemElement
                v-if="stats.elements"
                v-for="(count, schemaName) of stats.elements"
                :schemaName
                :count
                mode="compact"
            />
        </div>
    </template>
</template>
