<script lang="ts" setup>
defineProps<{ children: MainContentChildrenItem[] }>();
</script>

<template>
  <MainSection>
    <div
      class="gap-main p-main flex flex-col py-[calc(var(--spacing-main)*1.5)]"
    >
      <MainContentChild v-for="child of children" :child />
    </div>
  </MainSection>
</template>
