<script lang="ts" setup>
import type { MyIconName } from '#my-icons';

const phrase = await usePhrases(
    'theme',
    'theme_system',
    'theme_light',
    'theme_dark',
);

const themeOptions: Record<string, [MyIconName, string]> = {
    auto: ['sun-moon', phrase.theme_system],
    light: ['sun', phrase.theme_light],
    dark: ['moon', phrase.theme_dark],
};

const clientMode = ref(false);
const themeItem = ref(themeOptions.auto);
let cycle = () => {};

onMounted(() => {
    const { cycle: _cycle, theme } = useTheme();

    themeItem.value = themeOptions[theme.value];

    cycle = () => {
        _cycle();
        themeItem.value = themeOptions[theme.value];
    };

    clientMode.value = true;
});
</script>

<template>
    <AsideListItem
        v-if="clientMode"
        :icon="themeItem![0]"
        :main="phrase.theme"
        :secondary="themeItem![1]"
        @click="cycle"
    />
    <AsideListItem
        v-else
        :icon="themeOptions.auto![0]"
        :main="phrase.theme"
        :secondary="themeOptions.auto![1]"
    />
</template>
