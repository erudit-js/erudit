<script lang="ts" setup>
const { child } = defineProps<{ child: MainContentChildrenItem }>();

const hasExtra = child.stats || child.keyLinks;
</script>

<template>
  <div
    class="border-border hocus:ring-brand/25 hocus:border-brand group
      dark:bg-bg-aside rounded border bg-neutral-100 ring-2 ring-transparent
      transition-[border,box-shadow]"
  >
    <EruditLink :to="child.link" class="p-normal gap-small flex flex-col">
      <div class="gap-small micro:gap-normal flex items-center">
        <MyIcon
          :name="ICONS[child.type]"
          class="text-text-muted group-hocus:text-brand shrink-0 text-[1.2em]
            transition-[color]"
        />
        <h2
          class="group-hocus:text-brand gap-small micro:text-main-lg flex
            items-center font-bold transition-[color]"
        >
          {{ formatText(child.title) }}
        </h2>
      </div>

      <div v-if="child.description" class="text-text-muted">
        {{ formatText(child.description) }}
      </div>
    </EruditLink>
    <div
      v-if="hasExtra"
      class="border-t-border p-normal gap-normal flex flex-col border-t"
    >
      <div v-if="child.keyLinks" class="relative top-[1px]">
        <MainKeyLinks :elementSnippets="child.keyLinks" mode="children" />
      </div>
      <div v-if="child.stats">
        <MainContentStats :stats="child.stats" mode="children" />
      </div>
    </div>
  </div>
</template>
