<script lang="ts" setup>
defineProps<{ breadcrumbs: Breadcrumbs }>();

const phrase = await usePhrases('breadcrumb');
</script>

<template>
  <nav
    v-if="breadcrumbs.length > 0"
    :aria-label="phrase.breadcrumb"
    class="px-main py-main-half"
  >
    <ol
      class="gap-small max-micro:justify-center m-0 flex list-none flex-wrap
        p-0"
    >
      <li v-for="(breadcrumb, i) of breadcrumbs">
        <EruditLink
          :to="breadcrumb.link"
          class="gap-small text-text-dimmed hocus:text-text-muted flex
            items-center transition-[color]"
        >
          <MaybeMyIcon :name="breadcrumb.icon" class="text-[1.2em]" />
          <span>{{ formatText(breadcrumb.title) }}</span>
          <MyIcon
            name="chevron-right"
            :class="{
              'relative -left-[3px]': true,
              'rotate-90': i === breadcrumbs.length - 1,
            }"
          />
        </EruditLink>
      </li>
    </ol>
  </nav>
</template>
