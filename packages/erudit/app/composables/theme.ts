const themes = ['auto', 'light', 'dark'] as const;

export type Theme = (typeof themes)[number];
export type BinaryTheme = 'light' | 'dark';

export function useTheme() {
    const theme = useState<Theme>('theme', () => {
        return localStorage.getItem('theme') ?? ('auto' as any);
    });

    const binaryTheme = computed(() => {
        return theme.value === 'auto'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            : theme.value;
    });

    const cycle = () => {
        theme.value =
            themes[(themes.indexOf(theme.value) + 1) % themes.length]!;
    };

    return {
        theme,
        binaryTheme,
        cycle,
    };
}
