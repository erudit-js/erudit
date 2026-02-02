<script lang="ts" setup>
import Deps from './Deps.vue';
import Externals from './Externals.vue';

const { connections } = defineProps<{ connections?: ContentConnections }>();

const phrase = await usePhrases('connections');

const currentType = ref<keyof ContentConnections | undefined>(
  'hardDependencies',
);

const ownExternalsCount = computed(() => {
  return connections?.externals?.find((ext) => ext.type === 'own')?.items
    .length;
});

const parentExternalsCount = computed(() => {
  return connections?.externals
    ?.filter((ext) => ext.type === 'parent')
    .reduce((sum, ext) => sum + ext.items.length, 0);
});
</script>

<template>
  <section v-if="connections" class="px-main py-main-half">
    <MainSubTitle :title="phrase.connections + ':'" />
    <div
      class="gap-small micro:gap-normal micro:justify-start flex flex-wrap
        justify-center"
    >
      <template
        v-for="(items, type) of {
          hardDependencies: connections.hardDependencies,
          autoDependencies: connections.autoDependencies,
          dependents: connections.dependents,
        }"
      >
        <MainConnectionsButton
          v-if="items && items.length > 0"
          :type="type"
          :count="items.length"
          :active="currentType === type"
          @click="
            currentType === type
              ? (currentType = undefined)
              : (currentType = type)
          "
        />
      </template>
      <MainConnectionsButton
        v-if="connections.externals"
        type="externals"
        :active="currentType === 'externals'"
        @click="
          currentType === 'externals'
            ? (currentType = undefined)
            : (currentType = 'externals')
        "
      >
        <template #after>
          <div
            v-if="connections.externals"
            class="gap-small *:border-border *:pl-small flex items-center
              font-bold *:border-l"
          >
            <div
              v-if="ownExternalsCount"
              class="flex items-center gap-1 text-amber-600 dark:text-amber-400"
            >
              <MyIcon name="arrow/left" class="-scale-x-100" />
              <span>{{ ownExternalsCount }}</span>
            </div>
            <div v-if="parentExternalsCount" class="flex items-center gap-1">
              <MyIcon name="arrow/up-to-right" />
              <span>{{ parentExternalsCount }}</span>
            </div>
          </div>
        </template>
      </MainConnectionsButton>
    </div>
    <template v-if="currentType && connections[currentType]">
      <Deps
        v-if="currentType !== 'externals'"
        :deps="connections[currentType]!"
      />
      <Externals v-else :externals="connections[currentType]!" />
    </template>
  </section>
</template>
