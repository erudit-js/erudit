<script lang="ts" setup>
const asideState = useAsideState();
const canShowSwitches = useCanShowAsideSwitches();
const asideType = inject(asideTypeSymbol);

const isMajor = computed(() => asideType === AsideType.Major);
const isMinor = computed(() => asideType === AsideType.Minor);

if (import.meta.client) {
  callOnce(async () => {
    // Wait for possible layout shifts triggering scroll events
    await new Promise((resolve) => setTimeout(resolve, 100));

    let lastY = window.scrollY;
    let sumDelta = 0;
    let scrollTimeout: any;

    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      sumDelta += delta;

      asideState.value.scrolledUp = sumDelta <= 5;

      lastY = currentY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        sumDelta = 0;
      }, 200);
    });
  });
}
</script>

<template>
  <div
    :class="[
      /* Variables */
      `micro:[--_switchSize:110px] [--_switchGap:var(--spacing-main)]
      [--_switchSize:80px]`,
      /* */
      `fixed bottom-0 flex size-(--_switchSize) items-center justify-center
      pb-(--_switchGap) pl-(--_switchGap) transition-[left,right,opacity]`,
      {
        //
        // Major Global
        //
        'aside1:opacity-0': isMajor,
        // Major Can Show
        'left-0 opacity-100': isMajor && canShowSwitches,
        // Major Cannot Show
        '-left-(--_switchSize) opacity-0': isMajor && !canShowSwitches,

        //
        // Minor Global
        //
        'aside2:opacity-0 -scale-x-100': isMinor,
        // Minor Can Show
        'right-0 opacity-100': isMinor && canShowSwitches,
        // Minor Cannot Show
        '-right-(--_switchSize) opacity-0': isMinor && !canShowSwitches,
      },
    ]"
  >
    <button
      @click="asideState.opened = asideType"
      class="hocus:opacity-100 flex size-full cursor-pointer items-center
        justify-center bg-neutral-500 opacity-90
        shadow-[0_0_20px_20px_var(--color-bg-main)] transition-opacity"
    >
      <MyIcon name="aside-open" class="text-bg-main size-[60%]" />
    </button>
  </div>
</template>
