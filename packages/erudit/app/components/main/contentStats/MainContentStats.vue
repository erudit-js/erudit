<script lang="ts" setup>
import ItemElement from './ItemElement.vue';
import ItemLastChanged from './ItemLastChanged.vue';
import ItemMaterials from './ItemMaterials.vue';

const props = defineProps<{
  mode: 'single' | 'children';
  stats?: ContentStats;
  lastChangedDate?: Date;
}>();

const phrase = await usePhrases('stats');
</script>

<template>
  <section
    v-if="mode === 'single' && (stats || lastChangedDate)"
    class="px-main py-main-half"
  >
    <MainSubTitle :title="phrase.stats + ':'" />
    <div
      class="micro:justify-start gap-small micro:gap-normal flex flex-wrap
        justify-center"
    >
      <ItemMaterials
        v-if="stats?.materials"
        :count="stats.materials"
        mode="detailed"
      />
      <ItemElement
        v-if="stats?.elements"
        v-for="(count, schemaName) of stats.elements"
        :schemaName
        :count
        mode="detailed"
      />
      <ItemLastChanged v-if="lastChangedDate" :date="lastChangedDate" />
    </div>
  </section>
  <div
    v-else-if="mode === 'children' && stats"
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
