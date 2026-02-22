<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

const props = defineProps<{
  type: 'dependency' | 'dependent';
  unique: ContentDepUnique;
}>();

const loadingSvg = useLoadingSvg();

const iconKey = ref(0);
const icon = ref<MaybeMyIconName>(loadingSvg);

watch(icon, () => {
  iconKey.value += 1;
});

onMounted(async () => {
  try {
    icon.value = await getElementIcon(props.unique.schemaName);
  } catch {
    icon.value = '__missing';
  }
});
</script>

<template>
  <div class="gap-small flex items-center">
    <MyIcon
      name="arrow/up-to-right"
      :class="[
        'text-text-dimmed shrink-0',
        type === 'dependent' && 'relative -top-[3px] -scale-x-100 rotate-90',
      ]"
    />
    <MaybeMyIcon :key="iconKey" :name="icon" class="text-main-sm shrink-0" />
    <EruditLink :to="unique.link" class="text-hover-underline text-main-sm">
      {{ formatText(unique.title ?? unique.name) }}
      <MyIcon
        name="arrow/outward"
        class="text-text-disabled relative -top-1 inline text-[0.8em]"
      />
    </EruditLink>
  </div>
</template>
