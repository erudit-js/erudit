<script lang="ts" setup>
defineProps<{
  role: 'preamble-float' | 'preamble-static';
  decoration?: string;
}>();
</script>

<template>
  <template v-if="decoration">
    <section
      v-if="role === 'preamble-float'"
      class="p-small pr-main float-right pt-3 max-[700px]:hidden"
    >
      <ImageTint
        :src="fileUrl(decoration)"
        class="block aspect-square max-h-[125px] max-w-[125px]"
      />
    </section>
    <section
      v-else-if="role === 'preamble-static'"
      class="px-main py-main-half min-[700px]:hidden"
    >
      <ImageTint
        :src="fileUrl(decoration)"
        class="micro:m-0 m-auto block aspect-square max-h-[125px] max-w-[125px]"
      />
    </section>
  </template>
</template>
