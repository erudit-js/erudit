<script lang="ts" setup>
import ThemeSwitcher from './ThemeSwitcher.vue';
import BuildTime from './BuildTime.vue';
import Repository from './repository/Repository.vue';
import EngineVersion from './EngineVersion.vue';
</script>

<template>
  <AsideMajorPaneTemplate>
    <ScrollHolder direction="rtl">
      <ThemeSwitcher />
      <BuildTime />
      <Repository />
      <EngineVersion />
    </ScrollHolder>
  </AsideMajorPaneTemplate>
</template>
