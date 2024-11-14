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

const themeItem = ref(themeOptions.auto);

let _cycle = () => {};

onMounted(() => {
    const { cycle, theme } = useTheme();

    _cycle = cycle;

    watch(
        theme,
        () => {
            themeItem.value = (() => {
                switch (theme.value) {
                    case 'auto':
                        return themeOptions.auto;
                    case 'light':
                        return themeOptions.light;
                    case 'dark':
                        return themeOptions.dark;
                }
            })();
        },
        { immediate: true },
    );
});
</script>

<template>
    <ClientOnly>
        <AsideListItem
            @click="_cycle"
            :icon="themeItem![0]"
            :main="phrase.theme + ':'"
            :secondary="themeItem![1]"
        />
    </ClientOnly>
</template>
