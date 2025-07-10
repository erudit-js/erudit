const themes = ['auto', 'light', 'dark'] as const;

export type Theme = (typeof themes)[number];
export type BinaryTheme = 'light' | 'dark';

const _theme = ref<Theme>();

export function useTheme() {
    if (import.meta.server) {
        throw new Error(`Calling 'useTheme' on server side is prohibited!`);
    }

    function setTheme(newTheme: Theme) {
        localStorage.setItem('theme', newTheme);
        _theme.value = newTheme;
    }

    const localStorageTheme = localStorage.getItem('theme');

    if (themes.includes(localStorageTheme as any)) {
        setTheme(localStorageTheme as Theme);
    } else {
        console.warn(
            `Failed to get correct theme value from Local Storage!\nRetrieved "${localStorageTheme}"!`,
        );
        setTheme('auto');
    }

    const theme = computed<Theme>(() => _theme.value!);

    const binaryTheme = computed<BinaryTheme>(() => {
        return theme.value === 'auto'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            : theme.value;
    });

    const cycle = () => {
        const newTheme =
            themes[(themes.indexOf(theme.value) + 1) % themes.length]!;
        setTheme(newTheme);
    };

    return {
        theme,
        binaryTheme,
        cycle,
    };
}
