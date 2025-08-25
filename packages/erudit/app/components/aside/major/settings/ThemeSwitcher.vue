<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

const icon = ref<MaybeMyIconName>(loadingSvg);
const themeName = ref<string>();

let cycleThemeClick = () => {};

const phrase = await usePhrases(
    'theme',
    'theme_light',
    'theme_dark',
    'theme_system',
);

onMounted(() => {
    const { themePref, cycleTheme } = useTheme();

    watch(
        themePref,
        (newThemePref) => {
            switch (newThemePref) {
                case 'system':
                    icon.value = 'sun-moon';
                    themeName.value = phrase.theme_system;
                    break;
                case 'light':
                    icon.value = 'sun';
                    themeName.value = phrase.theme_light;
                    break;
                case 'dark':
                    icon.value = 'moon';
                    themeName.value = phrase.theme_dark;
                    break;
            }
        },
        { immediate: true },
    );

    cycleThemeClick = () => {
        cycleTheme();
    };
});
</script>

<template>
    <AsideListItem
        :icon
        :main="phrase.theme"
        :secondary="themeName"
        @click="cycleThemeClick"
    />
</template>
