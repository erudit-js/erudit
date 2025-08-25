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
            'micro:[--_switch-size:130px] absolute bottom-0 flex size-(--_switch-size) items-center justify-center transition-[left,right,opacity] [--_switch-size:100px]',
            canShowSwitches
                ? isMajor
                    ? 'aside1:right-0 aside1:opacity-0 -right-(--_switch-size) opacity-100'
                    : 'aside2:left-0 aside2:opacity-0 -left-(--_switch-size) opacity-100'
                : isMajor
                  ? 'right-0 opacity-0'
                  : 'left-0 opacity-0',
        ]"
    >
        <button
            @click="asideState.opened = asideType"
            :class="[
                'hocus:opacity-100 flex size-[60%] cursor-pointer items-center justify-center bg-neutral-500 opacity-90 shadow-[0_0_20px_20px_var(--color-bg-main)] transition-[opacity]',
                isMinor && '-scale-100',
            ]"
        >
            <MyIcon name="aside-open" class="text-bg-main size-[45%]" />
        </button>
    </div>
</template>
