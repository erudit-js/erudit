<script lang="ts" setup>
const props = defineProps<{ type: AsideType }>();
provide(asideTypeSymbol, props.type);

const asideState = useAsideState();

const isMajor = computed(() => props.type === AsideType.Major);
const isMinor = computed(() => props.type === AsideType.Minor);

const opened = computed(() => {
    return props.type === asideState.value.opened;
});
</script>

<template>
    <aside
        :class="[
            `absolute top-0 z-10 h-full w-(--w-aside) text-[18px]
            transition-[left,right]`,
            opened
                ? isMajor
                    ? 'left-0'
                    : 'right-0'
                : isMajor
                  ? 'aside1:left-0 -left-(--w-aside)'
                  : 'aside2:right-0 -right-(--w-aside)',
        ]"
    >
        <div class="sticky top-0 h-dvh">
            <AsideSwitch />
            <div
                :class="[
                    `bg-bg-aside absolute top-0 left-0 h-full w-full
                    border-[light-dark(var(--color-neutral-200),var(--color-neutral-800))]
                    transition-[background,border,backdrop-filter,box-shadow]`,
                    {
                        'border-e': isMajor,
                        'border-s': isMinor,
                        [`max-aside1:border-e-2 max-aside1:bg-bg-aside/96
                        max-aside1:backdrop-blur-sm
                        max-aside1:shadow-[0_0_20px_12px_light-dark(rgba(0,0,0,.14),rgba(255,255,255,.05))]`]:
                            opened && isMajor,
                        [`max-aside2:border-s-2 max-aside2:bg-bg-aside/96
                        max-aside2:backdrop-blur-sm
                        max-aside2:shadow-[0_0_20px_12px_light-dark(rgba(0,0,0,.14),rgba(255,255,255,.05))]`]:
                            opened && isMinor,
                    },
                ]"
            >
                <AsideMajor v-if="type === AsideType.Major" />
                <AsideMinor v-else />
                <!-- Inner aside shadow to separate aside from main content -->
                <div
                    :class="[
                        `pointer-events-none absolute top-0 h-full w-full
                        touch-none bg-linear-to-l
                        from-[light-dark(rgba(0,0,0,0.02),rgba(0,0,0,0.1))]
                        via-transparent via-[3px] opacity-100
                        transition-opacity`,
                        {
                            '-scale-100': isMinor,
                            'max-aside1:opacity-0': opened && isMajor,
                            'max-aside2:opacity-0': opened && isMinor,
                        },
                    ]"
                ></div>
            </div>
        </div>
    </aside>
</template>
