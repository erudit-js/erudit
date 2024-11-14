// Instant color theme setup
const theme = localStorage.getItem('theme') ?? 'auto';
const binaryTheme =
    theme === 'auto'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
        : theme;
document.documentElement.setAttribute('data-theme', binaryTheme);
