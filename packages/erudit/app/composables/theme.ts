const binaryThemes = ['light', 'dark'] as const;
const themePreferences = [...binaryThemes, 'system'] as const;
const localStorageKey = 'theme';

export type BinaryTheme = (typeof binaryThemes)[number];
export type ThemePreference = (typeof themePreferences)[number];

export const useTheme = () => {
    if (import.meta.server) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Theme composable is not available on server side!',
        });
    }

    const preference = useState(
        'theme-preference',
        () => localStorage.getItem(localStorageKey) as ThemePreference,
    );

    return {
        themePref: preference,
        binaryTheme: computed(() => pref2binary(preference.value)),
        setTheme: (newPref: ThemePreference) => {
            localStorage.setItem(localStorageKey, newPref);
            preference.value = newPref;
        },
        cycleTheme: () => {
            const current = preference.value;
            const next =
                themePreferences[
                    (themePreferences.indexOf(current) + 1) %
                        themePreferences.length
                ]!;
            localStorage.setItem(localStorageKey, next);
            preference.value = next;
        },
    };
};

export const useThemeWatcher = () => {
    onMounted(() => {
        const { themePref, binaryTheme } = useTheme();

        watch(binaryTheme, (newValue) => {
            document.documentElement.setAttribute('data-theme', newValue);
        });

        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (event) => {
                const newValue = event.matches ? 'dark' : 'light';
                if (themePref.value === 'system') {
                    document.documentElement.setAttribute(
                        'data-theme',
                        newValue,
                    );
                }
            });
    });
};

function pref2binary(pref: ThemePreference): BinaryTheme {
    if (binaryThemes.includes(pref as BinaryTheme)) {
        return pref as BinaryTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}
