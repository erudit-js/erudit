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
    :aria-label="phrase.stats"
    class="px-main py-main-half"
  >
    <MainSubTitle :title="phrase.stats + ':'" />
    <ul
      class="micro:justify-start gap-small micro:gap-normal m-0 flex list-none
        flex-wrap justify-center p-0"
    >
      <li v-if="stats?.materials">
        <ItemMaterials :count="stats.materials" mode="detailed" />
      </li>
      <template v-if="stats?.elements">
        <li v-for="(count, schemaName) of stats.elements">
          <ItemElement :schemaName :count mode="detailed" />
        </li>
      </template>
      <li v-if="lastChangedDate">
        <ItemLastChanged :date="lastChangedDate" />
      </li>
    </ul>
  </section>
  <div
    v-else-if="mode === 'children' && stats"
    class="gap-small micro:gap-normal text-main-sm micro:justify-start flex
      flex-wrap justify-center"
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
