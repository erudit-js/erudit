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
    <EruditLink
      v-if="child.decoration"
      :to="child.link"
      class="p-normal max-micro:pb-0 not-group-hocus:[--tint-opacity:0]
        micro:float-right block"
    >
      <ImageTint
        :src="fileUrl(child.decoration)"
        class="m-auto block aspect-square max-h-[90px] max-w-[90px]"
      />
    </EruditLink>

    <EruditLink :to="child.link" class="p-normal gap-small flex flex-col">
      <h2
        class="group-hocus:text-brand micro:text-main-lg micro:text-start
          text-center font-bold transition-[color]"
      >
        <MyIcon
          :name="ICONS[child.type]"
          class="text-text-muted group-hocus:text-brand mr-small relative
            -top-[1px] inline shrink-0 text-[1.2em] transition-[color]"
        />
        <span>{{ formatText(child.title) }}</span>
      </h2>

      <div
        v-if="child.description"
        class="text-text-muted micro:text-start text-center"
      >
        {{ formatText(child.description) }}
      </div>
    </EruditLink>
    <div v-if="hasExtra" class="px-normal pb-normal gap-normal flex flex-col">
      <div v-if="child.keyLinks">
        <MainKeyLinks :elementSnippets="child.keyLinks" mode="children" />
      </div>
      <div v-if="child.stats">
        <MainContentStats :stats="child.stats" mode="children" />
      </div>
    </div>
  </div>
</template>
